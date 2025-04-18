package de.keepmealive3d.core.services

import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.model.messages.*
import de.keepmealive3d.core.model.session.ReplayState
import de.keepmealive3d.core.model.session.WsSessionChannelData
import de.keepmealive3d.core.model.session.WsSessionData
import io.ktor.util.collections.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.util.*

interface IWsSessionService {
    fun newSession(info: Manifest): Result<WsSessionData>
    fun closeSession(uuid: String?, topic: String?): Result<Unit>
    fun topicSubscribe(info: SubscribeEvent): Result<Channel<GenericMessageEvent>>
    suspend fun startReplay(info: ReplayStartEvent): Result<Unit>
    fun stopReplay(info: ReplayStopEvent): Result<Unit>
    fun endReplay(info: Manifest): Result<Unit>

    suspend fun distributeLiveEvent(msg: GenericMessageEvent)
}

class WsSessionService : IWsSessionService, KoinComponent {
    private val replayService: IReplayService by inject()
    private val sessions = ConcurrentSet<WsSessionData>()
    private val replayScope = CoroutineScope(Dispatchers.IO)

    override fun newSession(info: Manifest): Result<WsSessionData> {
        val uuid = try {
            UUID.fromString(info.uuid)
        } catch (_: Exception) {
            return Result.failure(BadRequestDataException("Invalid session UUID"))
        }
        val wsSessionData = WsSessionData(
            uuid = uuid,
            channels = mutableListOf()
        )
        sessions.add(wsSessionData)
        return Result.success(wsSessionData)
    }

    override fun closeSession(uuid: String?, topic: String?): Result<Unit> {
        val wsSession = sessions.find { it.uuid.toString() == uuid } ?: return Result.failure(
            EntityNotFoundException("The session could not be found")
        )
        wsSession.channels.removeAll { it.topic == topic }
        if(wsSession.channels.isEmpty()) {
            wsSession.replayJob?.cancel()
            sessions.remove(wsSession)
        }
        return Result.success(Unit)
    }

    override fun topicSubscribe(info: SubscribeEvent): Result<Channel<GenericMessageEvent>> {
        val wsSession = sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
            return Result.failure(it)
        }
        val channel = Channel<GenericMessageEvent>()
        val wsChannelData = WsSessionChannelData(info.message.topic, channel)
        wsSession.channels.add(wsChannelData)
        return Result.success(channel)
    }

    override suspend fun startReplay(info: ReplayStartEvent): Result<Unit> {
        val wsSession = sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
            return Result.failure(it)
        }
        wsSession.replayStart = info.start
        wsSession.replayEnd = info.end
        wsSession.replayState = ReplayState.RUNNING
        wsSession.replayJob?.cancel()   //cancel old replay

        wsSession.replayJob = replayScope.launch {
            replayService.startReplay(wsSession, info.start, info.end)
        }
        return Result.success(Unit)
    }

    override fun stopReplay(info: ReplayStopEvent): Result<Unit> {
        val wsSession = sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
            return Result.failure(it)
        }
        if (wsSession.replayState == ReplayState.NOT_IN_REPLAY) {
            return Result.failure(BadRequestDataException("There is no replay to stop for this session"))
        }
        wsSession.replayJob?.cancel()
        wsSession.replayJob = null
        wsSession.replayState = ReplayState.STOPPED
        wsSession.replayStart = info.stop   //set the start to the clients current timestamp to resume from that timestamp
        return Result.success(Unit)
    }

    override fun endReplay(info: Manifest): Result<Unit> {
        val wsSession = sessions.find { it.uuid.toString() == info.uuid } ?: newSession(info).getOrElse {
            return Result.failure(it)
        }
        wsSession.replayStart = null
        wsSession.replayEnd = null
        wsSession.replayState = ReplayState.NOT_IN_REPLAY
        wsSession.replayJob?.cancel()
        wsSession.replayJob = null

        return Result.success(Unit)
    }

    override suspend fun distributeLiveEvent(msg: GenericMessageEvent) {
        sessions
            //check not in replay
            .filter { it.replayState == ReplayState.NOT_IN_REPLAY }
            //in session filter channels for specified topic
            .map {
                it.channels.filter { it.topic == msg.message.topic }
            }
            //list of lists to one big list (session independent)
            .flatten()
            //only channels
            .map { it.channel }
            //send event
            .forEach { channel ->
                channel.send(msg)
            }
    }
}