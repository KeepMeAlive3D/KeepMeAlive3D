package de.keepmealive3d.core.services.replay

import de.keepmealive3d.adapters.data.ReplayInfo
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import de.keepmealive3d.core.services.IEventLogService
import io.ktor.util.collections.*
import kotlinx.coroutines.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.LoggerFactory

interface IReplayService {
    fun startReplay(dt: Int, refId: Int, trace: String, owner: Int)
    fun stopReplay(dt: Int, refId: Int, trace: String, owner: Int)
    fun pauseReplay(dt: Int, refId: Int, trace: String, owner: Int)
    fun resumeReplay(dt: Int, refId: Int, trace: String, owner: Int)
    fun skipReplay(dt: Int, refId: Int, trace: String, owner: Int, toOffset: Long)
    fun getReplay(dt: Int, refId: Int, trace: String, owner: Int): List<ReplayInfo>
}

class ReplayService: IReplayService, KoinComponent {
    data class Replay(
        val topic: String,
        val mainLoop: ReplayMainLoop,
        val job: Job
    )

    private val eventLogService by inject<IEventLogService>()

    private val logger = LoggerFactory.getLogger("ReplaysService")
    private val replays = ConcurrentSet<Replay>()
    private val scope = CoroutineScope(Dispatchers.IO)

    private fun getTopic(refId: Int, trace: String) = "replay-${refId}-${trace}"

    override fun startReplay(dt: Int, refId: Int, trace: String, owner: Int) {
        logger.info("Starting Replay for refId: $refId and trace: $trace")

        val topic = getTopic(refId, trace)
        if(replays.find { it.topic == topic }?.job?.isActive == true) {
            return
        }
        val replay = ReplayMainLoop(owner, dt, refId, trace)

        val job = scope.launch {
            delay(1_000)
            replay.start()

            delay(1_000)

            replays.removeAll { it.topic == topic }
        }

        replays.add(
            Replay(
                topic,
                replay,
                job
            )
        )
    }

    override fun stopReplay(dt: Int, refId: Int, trace: String, owner: Int) {
        replays.filter { it.topic == getTopic(refId, trace) }.forEach {
            it.mainLoop.destroy()
            it.job.cancel()
        }
        replays.removeAll { it.topic == getTopic(refId, trace) }
    }

    override fun pauseReplay(dt: Int, refId: Int, trace: String, owner: Int) {
        replays.filter { it.topic == getTopic(refId, trace) }.forEach {
            it.mainLoop.pause()
        }
    }

    override fun resumeReplay(dt: Int, refId: Int, trace: String, owner: Int) {
        replays.filter { it.topic == getTopic(refId, trace) }.forEach {
            it.mainLoop.resume()
        }
    }

    override fun skipReplay(
        dt: Int,
        refId: Int,
        trace: String,
        owner: Int,
        toOffset: Long
    ) {
        replays.filter { it.topic == getTopic(refId, trace) }.forEach {
            it.mainLoop.skipTo(toOffset)
        }
    }

    override fun getReplay(dt: Int, refId: Int, trace: String, owner: Int): List<ReplayInfo> {
        return replays.firstOrNull { it.topic == getTopic(refId, trace) }?.let {
            val replayComponents = it.mainLoop.participants.map { participantLog ->
                val state = participantLog.getCurrentState()
                val activeStates = participantLog.getActiveStates()
                if(state == null)
                    return@map null
                else
                    return@map ReplayInfo(dt, refId, EventLogTableType.PARTICIPANT, participantLog.participantId.toString(), state, activeStates)
            }.filterNotNull().toMutableList()

            it.mainLoop.processLog?.let { processLog ->
                processLog.getCurrentState()?.let { state ->
                    replayComponents.add(ReplayInfo(
                        dt = dt,
                        refId = refId,
                        EventLogTableType.PROCESS,
                        "",
                        state,
                        emptyList()
                    ))
                }
            }

            return replayComponents
        } ?: run {
            eventLogService.getAll(owner, dt, refId).map { log ->
                val trace = log.eventLog.traces.firstOrNull { it.name == trace } ?: return@map null

                ReplayInfo(
                    dt = dt,
                    refId = refId,
                    type = log.type,
                    typeId = log.typeId,
                    state = trace,
                    activeStates = emptyList()
                )
            }.filterNotNull()
        }
    }
}