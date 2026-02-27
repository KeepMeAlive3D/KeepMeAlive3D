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
import kotlin.time.DurationUnit
import kotlin.time.measureTime

class ReplayMainLoop(owner: Int, dt: Int, logRef: Int, trace: String) : KoinComponent {
    private val eventLogService: IEventLogService by inject()
    private val sessionData: ConcurrentMap<UUID, WsSessionData> by inject(qualifier("wsSessionData"))

    val topic = "replay-${logRef}-${trace}"
    private val replayScope = CoroutineScope(Dispatchers.IO)
    private var offsetMillis = AtomicLong(0L)
    private var isPaused = AtomicBoolean(false)

    val participants = eventLogService
        .getAll(owner, dt, logRef)
        .filter { it.type == EventLogTableType.PARTICIPANT }
        .map { ReplayParticipantLog(owner, dt, logRef, trace, it.typeId.toInt(), it, topic) }

    val processLog = eventLogService.getAll(owner, dt, logRef).firstOrNull { it.type == EventLogTableType.PROCESS }?.let {
        ReplayProcessLog(owner, dt, logRef, trace, it, topic)
    }

    suspend fun start() {
        // if all participants are finished and process log is finished, when exist -> stop the loop
        while (!(participants.all { it.replayComplete } && ((processLog != null && processLog.replayComplete) || processLog == null))) {
            val currOffset = measureTime {
                delay(100)  //delay 100 ms is minimum, we can't say for sure that its exactly 100mx
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
        sessionData.map { it.value }.forEach { session ->
            session.channels.forEach { channel ->
                if(channel.topic == topic) {
                    channel.channel.close()
                }
            }
            session.channels.removeAll {
                it.topic == topic
            }
        }
    }
}