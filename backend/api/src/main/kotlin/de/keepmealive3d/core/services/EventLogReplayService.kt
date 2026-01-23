package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.core.model.messages.*
import de.keepmealive3d.core.model.session.WsSessionData
import dev.klenz.matthias.kscxml.KScxml
import dev.klenz.matthias.kscxml.execution.KScxmlExecutor
import dev.klenz.matthias.kscxml.execution.state.InternalScxmlState
import kotlinx.coroutines.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.LoggerFactory
import java.time.Instant
import java.util.concurrent.atomic.AtomicReference

interface IEventLogReplayService {
    suspend fun startReplay(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String)
    suspend fun continueReplay(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String)
    suspend fun pauseReplay(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String)
    suspend fun stepForward(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String)
    fun end(owner: Int, dt: Int, id: Int, trace: String)
    fun getWithState(owner: Int, dt: Int, id: Int, trace: String): List<EventLog.Event>
}

class EventLogReplayService : KoinComponent, IEventLogReplayService {

    /**
     * @param id the id of the event log
     * @param owner the user that uploaded the eventlog
     * @param trace the identifier of the trace to replay
     * @param dt the digital twin id the eventlog is part of
     * @param currentEvent an atomic ref to the current event that is executed
     * @param allEvents all events in the trace sorted and filtered for the timestamp
     * @param executor the JavaScript environment for the state chart
     * @param secondsUntilNextEventOnPause when paused the seconds until the next event is triggered is saved here
     * @param waitUntil the Timestamp until the next event can be executed
     */
    data class ActiveReplayInfo(
        val id: Int,
        val owner: Int,
        val trace: String,
        val dt: Int,
        val currentEvent: AtomicReference<EventLog.Event>,
        val allEvents: List<EventLog.Event>,
        val executor: KScxmlExecutor,
        val secondsUntilNextEventOnPause: AtomicReference<Long>,
        val waitUntil: AtomicReference<Instant>,
        val isPaused: AtomicReference<Boolean>,
    )

    private val replays = mutableListOf<ActiveReplayInfo>()
    private val activeReplayJobs = mutableMapOf<Pair<Int, String>, Job>()
    private val eventLogService: IEventLogService by inject()
    private val stateMachineService: StateMachineService by inject()
    private val processParticipantService: IProcessParticipantService by inject()
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val logger = LoggerFactory.getLogger("EventLogReplayService")

    override suspend fun startReplay(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String) {
        val eventLog = eventLogService.get(owner, dt, id)
        val trace = eventLog.eventLog.traces.firstOrNull { it.name == trace }
        if (trace == null) {
            return
        }
        val processParticipants = processParticipantService.getAll(dt, owner)
        val participant = processParticipants.firstOrNull {
            stateMachineService.getAllStateMachineFiles(owner, dt, it.id).isNotEmpty()
        } ?: run {
            logger.warn("Could not find participant with a state machine")
            return
        }
        val stateMachine =
            stateMachineService.getAllStateMachineFiles(owner, dt, participant.id).firstOrNull() ?: run {
                logger.warn("Could not find state machine for $id.")
                return
            }
        val node = KScxml.load(stateMachine.readText()).rootNode ?: run {
            logger.warn("Could not load state machine ${stateMachine.name}")
            return
        }
        val internalScxmlState = InternalScxmlState()
        val executor = KScxmlExecutor(node, internalScxmlState)

        val job = scope.launch {
            // send transitions of the state machine to the client
            executor.registerTransitionEventListener { from, to ->
                sessionData.channels.forEach { channel ->
                    if (channel.topic == "replay-${id}-${trace}") {
                        runBlocking {
                            channel.channel.send(
                                StateTransitionInfo(
                                    Manifest(1, MessageType.STATE_TRANSITION),
                                    StateTransitionInfoData(
                                        from = from.id ?: "unknown",
                                        to = to.id ?: "unknown",
                                        dataSource = "replay-service",
                                        topic = "replay-${id}-${trace}",
                                        allEvents = getWithState(owner, dt, id, trace.name ?: "unknown")
                                    )
                                )
                            )
                        }
                    }
                }
            }

            val sorted = trace.events.filter { it.datetime != null }.sortedBy { it.datetime }
            val info = ActiveReplayInfo(
                id = id,
                owner = owner,
                trace = trace.name!!,
                dt = dt,
                currentEvent = AtomicReference(sorted.first()),
                allEvents = sorted,
                executor = executor,
                secondsUntilNextEventOnPause = AtomicReference(0L),
                waitUntil = AtomicReference(Instant.now()),
                isPaused = AtomicReference(false),
            )
            replays.add(info)

            delay(2_000)
            executor.start()
            delay(2_000)

            runEventLogLoop(info, sessionData)
        }

        activeReplayJobs[id to trace.name!!] = job
    }

    override suspend fun continueReplay(
        sessionData: WsSessionData,
        owner: Int,
        dt: Int,
        id: Int,
        trace: String
    ) {
        replays.firstOrNull { it.id == id && it.trace == trace }?.let {
            val secondsToAdd = it.secondsUntilNextEventOnPause.get()
            it.waitUntil.set(Instant.now().plusSeconds(secondsToAdd))
            it.secondsUntilNextEventOnPause.set(0)
            it.isPaused.set(false)
        } ?: startReplay(sessionData, owner, dt, id, trace)
    }

    override suspend fun pauseReplay(
        sessionData: WsSessionData,
        owner: Int,
        dt: Int,
        id: Int,
        trace: String
    ) {
        replays.firstOrNull { it.id == id && it.trace == trace }?.let {
            val until = it.waitUntil.get()
            it.secondsUntilNextEventOnPause.set((until.epochSecond - Instant.now().epochSecond).coerceAtLeast(0))
            it.waitUntil.set(Instant.MAX)
            it.isPaused.set(true)
        }
    }

    override suspend fun stepForward(
        sessionData: WsSessionData,
        owner: Int,
        dt: Int,
        id: Int,
        trace: String
    ) {
        replays.firstOrNull { it.id == id && it.trace == trace }?.let {
            it.waitUntil.set(Instant.now())
            it.secondsUntilNextEventOnPause.set(0)
        }
    }

    override fun end(owner: Int, dt: Int, id: Int, trace: String) {
        replays.firstOrNull { it.id == id && it.trace == trace }?.let {
            it.currentEvent.set(it.allEvents.last())
            it.waitUntil.set(Instant.now())
            it.secondsUntilNextEventOnPause.set(0)
        }
        activeReplayJobs[id to trace]?.cancel("Replay Stopped")
        activeReplayJobs.remove(id to trace)
        replays.removeIf { it.id == id && it.trace == trace }
    }

    override fun getWithState(
        owner: Int,
        dt: Int,
        id: Int,
        trace: String
    ): List<EventLog.Event> {
        replays.firstOrNull { it.id == id && it.trace == trace }?.let { eventReplayInfo ->
            return eventReplayInfo.allEvents.mapIndexed { index, event ->
                val currentIndex = eventReplayInfo.allEvents.indexOf(eventReplayInfo.currentEvent.get())
                EventLog.Event(
                    name = event.name,
                    datetime = event.datetime,
                    source = event.source,
                    value = event.value,
                    replayState =
                        if (currentIndex == index) EventLog.EventReplayState.ACTIVE
                        else if (currentIndex < index) EventLog.EventReplayState.EXECUTED
                        else EventLog.EventReplayState.NOT_EXECUTED,
                )
            }
        }
        return emptyList()
    }

    private suspend fun runEventLogLoop(info: ActiveReplayInfo, wsSessionData: WsSessionData) {
        while (info.currentEvent.get() != info.allEvents.last()) {
            if (info.waitUntil.get().isBefore(Instant.now())) {
                try {
                    delay(100)
                } catch (e: InterruptedException) {
                    logger.info("Interrupted while waiting for replay events: ${e.cause}")
                    break
                }
                continue    //skip
            }

            //execute event
            val current = info.currentEvent.get()
            current.name?.let { name -> info.executor.onEvent(name) }

            //prep next event
            val index = info.allEvents.indexOf(info.currentEvent.get())
            if (index < info.allEvents.size - 1) { //sanity check, should always be true
                val next = info.allEvents[index + 1]
                val timeOffset = next.datetime!!.toEpochMilli() - current.datetime!!.toEpochMilli()

                sendCurrentEventToClient(wsSessionData, info)

                if (info.isPaused.get()) {
                    info.waitUntil.set(Instant.MAX)
                    info.secondsUntilNextEventOnPause.set(next.datetime.epochSecond - current.datetime.epochSecond)
                } else {
                    info.waitUntil.set(Instant.now().plusSeconds(timeOffset))
                    info.secondsUntilNextEventOnPause.set(0)
                }
            } else {
                break
            }
        }
    }

    private suspend fun sendCurrentEventToClient(wsSessionData: WsSessionData, info: ActiveReplayInfo) {
        wsSessionData.channels.forEach { channel ->
            if (channel.topic == "replay-${info.id}-${info.trace}") {
                channel.channel.send(
                    DataPointMessageEvent(
                        Manifest(1, MessageType.TOPIC_DATAPOINT, info.currentEvent.get().datetime),
                        DataPointMessageData(
                            "replay-${info.id}-${info.trace}",
                            info.currentEvent.get().source ?: "unknown",
                            info.currentEvent.get().value?.toDoubleOrNull() ?: 0.0
                        )
                    )
                )
            }
        }
    }
}