package de.keepmealive3d.core.services.replay

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.adapters.data.EventLog.EventReplayState
import de.keepmealive3d.adapters.data.EventLogRefInfo
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import de.keepmealive3d.core.model.messages.Manifest
import de.keepmealive3d.core.model.messages.MessageType
import de.keepmealive3d.core.model.messages.StateTransitionInfo
import de.keepmealive3d.core.model.messages.StateTransitionInfoData
import de.keepmealive3d.core.model.session.WsSessionData
import io.ktor.util.collections.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.ClosedSendChannelException
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier
import org.slf4j.LoggerFactory
import java.time.Instant
import java.util.*
import java.util.concurrent.atomic.AtomicReference

class ReplayProcessLog(
    private val owner: Int,
    private val dt: Int,
    private val refId: Int,
    private val trace: String,
    val logInfo: EventLogRefInfo,
    private val topic: String,
): KoinComponent {
    /**
     * @param id the id of the event log
     * @param owner the user that uploaded the eventlog
     * @param trace the identifier of the trace to replay
     * @param dt the digital twin id the eventlog is part of
     * @param currentEvent an atomic ref to the current event that is executed
     * @param allEvents all events in the trace sorted and filtered for the timestamp
     * @param secondsUntilNextEventOnPause when paused the seconds until the next event is triggered is saved here
     * @param waitUntil the Timestamp until the next event can be executed
     */
    data class ProcessReplayInfo(
        val id: Int,
        val owner: Int,
        val trace: String,
        val dt: Int,
        val currentEvent: AtomicReference<EventLog.Event>,
        val allEvents: List<EventLog.Event>,
        val secondsUntilNextEventOnPause: AtomicReference<Long>,
        val waitUntil: AtomicReference<Instant>,
        val isPaused: AtomicReference<Boolean>,
    )

    private val sessionData: ConcurrentMap<UUID, WsSessionData> by inject(qualifier("wsSessionData"))
    private val logger = LoggerFactory.getLogger("ReplayProcessLog_$trace")
    var replayComplete: Boolean = false
        private set
    private val traceObj = logInfo.eventLog.traces.firstOrNull { it.name == trace } ?: run {
        logger.warn("Trace not found for processLog $refId and trace $trace")
        null
    }
    private val start = traceObj?.events?.firstOrNull { it.datetime != null }?.datetime ?: run {
        logger.warn("No start time for processLog $refId and trace $trace")
        null
    }
    private val end = traceObj?.events?.lastOrNull { it.datetime != null }?.datetime ?: run {
        logger.warn("No end time for processLog $refId and trace $trace")
        null
    }
    private val alreadySend = mutableListOf<String>()

    private val processReplay: ProcessReplayInfo
    init {
        val sorted = traceObj?.events?.filter { it.datetime != null }?.sortedBy { it.datetime } ?: emptyList()
        //sorted.firstOrNull()?.let { it.replayState = EventReplayState.ACTIVE }
        processReplay = ProcessReplayInfo(
            id = refId,
            owner = owner,
            trace = trace,
            dt = dt,
            currentEvent = AtomicReference(sorted.first()),
            allEvents = sorted,
            secondsUntilNextEventOnPause = AtomicReference(0L),
            waitUntil = AtomicReference(Instant.now()),
            isPaused = AtomicReference(false),
        )
    }

    fun getCurrentState(): EventLog.Trace? {
        val t = logInfo.eventLog.traces.firstOrNull { it.name == trace }
        if(t == null) return null
        return EventLog.Trace(
            t.name,
            processReplay.allEvents,
            getReplayState(),
        )
    }

    private fun getReplayState(): EventLog.ReplayState {
        if(replayComplete) {
            return EventLog.ReplayState.END
        }
        if(processReplay.isPaused.get()) {
            return EventLog.ReplayState.PAUSED
        }
        return EventLog.ReplayState.RUNNING
    }


    suspend fun updateObservers(replayOffset: Long) {
        if (replayComplete) {
            return
        }
        if (end == null) {
            replayComplete = true
            return
        }
        if (start == null) {
            replayComplete = true
            return
        }
        if (start.toEpochMilli() + replayOffset >= end.toEpochMilli()) {
            replayComplete = true
            return
        }
        if (traceObj == null) {
            replayComplete = true
            return
        }


        traceObj.events.filter { it.datetime != null && it.name != null && !alreadySend.contains(it.name) }
            .forEach { event ->
                val offset = event.datetime!!.toEpochMilli() - start.toEpochMilli()
                if (offset < replayOffset) {
                    alreadySend.add(event.name!!)
                    processReplay.allEvents.filter { it.name == event.name }.forEach { event ->
                        processReplay.currentEvent.set(event)
                    }
                    sendCurrentEventToClient()
                }
            }
    }

    private suspend fun sendCurrentEventToClient(
        from: String = "",
        to: String = "",
        activeStates: List<String> = emptyList()
    ) {
        val listeners = sessionData
            .map { it.value }
            .flatMap { sessionData -> sessionData.channels.filter { it.topic == topic }.map { it.channel } }

        logger.info("Sending current event: ${processReplay.currentEvent.get()} to ${listeners.size} channels")
        val allEvents = processReplay.allEvents.mapIndexed { index, event ->
            val currentIndex = processReplay.allEvents.indexOf(processReplay.currentEvent.get())
            EventLog.Event(
                name = event.name,
                datetime = event.datetime,
                source = event.source,
                value = event.value,
                replayState =
                    if (index == currentIndex) EventReplayState.ACTIVE
                    else if (index < currentIndex) EventReplayState.EXECUTED
                    else EventReplayState.NOT_EXECUTED,
            )
        }

        listeners.forEach {
            try {
                it.send(
                    StateTransitionInfo(
                        Manifest(1, MessageType.STATE_TRANSITION, processReplay.currentEvent.get().datetime),
                        StateTransitionInfoData(
                            from,
                            to,
                            topic,
                            processReplay.currentEvent.get().source ?: "unknown",
                            activeStates,
                            allEvents,
                            type = EventLogTableType.PROCESS,
                            typeId = "",
                            dt = dt
                        )
                    )
                )
            } catch (e: ClosedSendChannelException) {
                logger.warn("Failed to send current event: ${processReplay.currentEvent.get()} to a closed channel: ${e.cause}")
            }
        }
    }
}