package de.keepmealive3d.core.services

import de.keepmealive3d.core.model.messages.*
import de.keepmealive3d.core.model.session.WsSessionData
import dev.klenz.matthias.kscxml.KScxml
import dev.klenz.matthias.kscxml.execution.KScxmlExecutor
import dev.klenz.matthias.kscxml.execution.state.InternalScxmlState
import kotlinx.coroutines.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.LoggerFactory

interface IEventLogReplayService {
    suspend fun startReplay(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String)
    fun stop(owner: Int, dt: Int, id: Int, trace: String)
}

class EventLogReplayService : KoinComponent, IEventLogReplayService {
    private val activeReplays = mutableMapOf<Pair<Int, String>, Job>()
    private val eventLogService: IEventLogService by inject()
    private val stateMachineService: StateMachineService by inject()
    private val processParticipantService: IProcessParticipantService by inject()
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val logger = LoggerFactory.getLogger("EventLogReplayService")

    override suspend fun startReplay(sessionData: WsSessionData, owner: Int, dt: Int, id: Int, trace: String) {
        val job = scope.launch {
            val eventLog = eventLogService.get(owner, dt, id)
            val trace = eventLog.eventLog.traces.firstOrNull { it.name == trace }
            if (trace == null) {
                return@launch
            }
            val processParticipants = processParticipantService.getAll(dt, owner)
            val participant = processParticipants.firstOrNull { stateMachineService.getAllStateMachineFiles(owner, dt, it.id).isNotEmpty() } ?: run {
                logger.warn("Could not find participant with a state machine")
                return@launch
            }
            val stateMachine = stateMachineService.getAllStateMachineFiles(owner, dt, participant.id).firstOrNull() ?: run {
                logger.warn("Could not find state machine for $id.")
                return@launch
            }
            val node = KScxml.load(stateMachine.readText()).rootNode ?: run {
                logger.warn("Could not load state machine ${stateMachine.name}")
                return@launch
            }
            val internalScxmlState = InternalScxmlState()
            val executor = KScxmlExecutor(node, internalScxmlState)
            executor.registerTransitionEventListener { from, to ->
                sessionData.channels.forEach { channel ->
                    if (channel.topic == "replay-${id}-${trace}") {
                        runBlocking {
                            channel.channel.send(
                                StateTransitionInfo(
                                    Manifest(1, MessageType.TOPIC_DATAPOINT),
                                    StateTransitionInfoData(
                                        from = from.id ?: "unknown",
                                        to = to.id ?: "unknown",
                                        dataSource = "replay-service",
                                        topic = "replay-${id}-${trace}"
                                    )
                                )
                            )
                        }
                    }
                }
            }

            val sorted = trace.events.filter { it.datetime != null }.sortedBy { it.datetime }
            delay(2_000)
            executor.start()
            delay(2_000)
            var lastTime = sorted.first().datetime!!.toEpochMilli()
            sorted.forEach {
                try {
                    delay(it.datetime!!.toEpochMilli() - lastTime)
                } catch (e: InterruptedException) {
                    logger.info("Replay for ${eventLog.eventLog.name} interrupted: ${e.cause}")
                    return@forEach
                }

                it.name?.let { name ->  executor.onEvent(name) }

                lastTime = it.datetime.toEpochMilli()
                sessionData.channels.forEach { channel ->
                    if (channel.topic == "replay-${id}-${trace}") {
                        channel.channel.send(
                            DataPointMessageEvent(
                                Manifest(1, MessageType.TOPIC_DATAPOINT, it.datetime),
                                DataPointMessageData(
                                    "replay-${id}-${trace}",
                                    it.source ?: "unknown",
                                    it.value?.toDoubleOrNull() ?: 0.0
                                )
                            )
                        )
                    }
                }
            }
        }
        activeReplays[id to trace] = job
    }

    override fun stop(owner: Int, dt: Int, id: Int, trace: String) {
        activeReplays[id to trace]?.cancel("Replay Stopped")
        activeReplays.remove(id to trace)
    }
}