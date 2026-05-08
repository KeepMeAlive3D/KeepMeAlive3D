package de.keepmealive3d.core.services.replay

import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import de.keepmealive3d.core.model.session.WsSessionData
import de.keepmealive3d.core.services.IEventLogService
import io.ktor.util.collections.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier
import java.util.*
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicLong
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit
import kotlin.time.measureTime

class ReplayMainLoop(owner: Int, dt: Int, logRef: Int, trace: String) : KoinComponent {
    private val eventLogService: IEventLogService by inject()
    private val sessionData: ConcurrentMap<UUID, WsSessionData> by inject(qualifier("wsSessionData"))

    val topic = "replay-${logRef}-${trace}"
    private val replayScope = CoroutineScope(Dispatchers.IO)
    private var offsetMillis = AtomicLong(0L)
    private var isPaused = AtomicBoolean(false)

    val allParticipants = eventLogService.getAll(owner, dt, logRef)
    val startOffset = allParticipants.mapNotNull {
        it
            .eventLog
            .traces
            .firstOrNull { t -> t.name == trace }   // only look at own traces
            ?.events
            ?.filter { e -> e.datetime != null }
            ?.minOf { e -> e.datetime!!.toEpochMilli() }    //first timestamp of each event log trace
    }.min() //first timestamp of all event logs

    val participants = allParticipants
        .filter { it.type == EventLogTableType.PARTICIPANT }
        .map { ReplayParticipantLog(owner, dt, logRef, trace, it.typeId.toInt(), it, topic, startOffset) }

    val processLog =
        eventLogService.getAll(owner, dt, logRef).firstOrNull { it.type == EventLogTableType.PROCESS }?.let {
            ReplayProcessLog(owner, dt, logRef, trace, it, topic, startOffset)
        }

    suspend fun start() {
        // if all participants are finished and process log is finished, when exist -> stop the loop
        while (!(participants.all { it.replayComplete } && ((processLog != null && processLog.replayComplete) || processLog == null))) {
            val currOffset = measureTime {
                delay(100.milliseconds)  //delay 100 ms is minimum, we can't say for sure that its exactly 100mx
            }
            val time = if (isPaused.get()) {
                offsetMillis.get()
            } else {
                offsetMillis.addAndGet(currOffset.toLong(DurationUnit.MILLISECONDS))
            }

            replayScope.launch {
                processLog?.updateObservers(time)
                participants.forEach { it.updateObservers(time) }
            }
        }

        //replay end
        delay(1.seconds)
        destroy()
    }

    fun skipTo(offsetMillis: Long) {
        this.offsetMillis.set(offsetMillis)
    }

    fun pause() {
        isPaused.set(true)
    }

    fun resume() {
        isPaused.set(false)
    }

    fun destroy() {
        participants.forEach { participant -> participant.onEnd() }
        sessionData.map { it.value }.forEach { session ->
            session.channels.forEach { channel ->
                if (channel.topic == topic) {
                    channel.channel.close()
                }
            }
            session.channels.removeAll {
                it.topic == topic
            }
        }
    }
}