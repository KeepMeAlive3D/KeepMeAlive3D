package de.keepmealive3d.core.services

import de.keepmealive3d.core.auth.JWT
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.model.messages.*
import de.keepmealive3d.core.model.session.WsSessionChannelData
import de.keepmealive3d.core.model.session.WsSessionData
import io.ktor.util.collections.*
import kotlinx.coroutines.channels.Channel
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.util.*

interface IWsSessionService {
    fun newSession(info: Manifest): Result<WsSessionData>
    fun closeSession(uuid: String?, topic: String?): Result<Unit>
    fun topicSubscribe(info: SubscribeEvent): Result<Channel<GenericMessageEvent>>
    suspend fun startReplay(info: ReplayStartEvent): Result<Unit>
    suspend fun pauseReplay(info: ReplayPauseEvent): Result<Unit>
    fun endReplay(info: ReplayEndEvent): Result<Unit>
    suspend fun forwardReplay(info: ReplayForwardEvent): Result<Unit>

    suspend fun distributeLiveEvent(msg: GenericMessageEvent)
}

class WsSessionService : IWsSessionService, KoinComponent {
    private val sessions = ConcurrentSet<WsSessionData>()
    private val eventLogReplayService: EventLogReplayService by inject()
    private val jwt: JWT by inject()

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
        wsSession.channels.filter { it.topic == topic }.forEach { it.channel.close() }
        wsSession.channels.removeAll { it.topic == topic }
        if (wsSession.channels.isEmpty()) {
            sessions.remove(wsSession)
        }
        return Result.success(Unit)
    }

    override fun topicSubscribe(info: SubscribeEvent): Result<Channel<GenericMessageEvent>> {
        val wsSession =
            sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
                return Result.failure(it)
            }
        val channel = Channel<GenericMessageEvent>()
        val wsChannelData = WsSessionChannelData(info.message.topic, channel)
        wsSession.channels.add(wsChannelData)
        return Result.success(channel)
    }

    override suspend fun startReplay(info: ReplayStartEvent): Result<Unit> {
        val wsSession =
            sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
                return Result.failure(it)
            }
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err ->  return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        eventLogReplayService.startReplay(wsSession, userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override suspend fun pauseReplay(info: ReplayPauseEvent): Result<Unit> {
        val wsSession =
            sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
                return Result.failure(it)
            }
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err ->  return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        eventLogReplayService.pauseReplay(wsSession, userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override fun endReplay(info: ReplayEndEvent): Result<Unit> {
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err ->  return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        eventLogReplayService.end(userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override suspend fun forwardReplay(info: ReplayForwardEvent): Result<Unit> {
        val wsSession =
            sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
                return Result.failure(it)
            }
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err ->  return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        eventLogReplayService.stepForward(wsSession, userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override suspend fun distributeLiveEvent(msg: GenericMessageEvent) {
        sessions
            //in session filter channels for specified topic
            .map {
                it.channels.filter { c -> c.topic == msg.message.topic }
            }
            //list of lists to one big list (session independent)
            .flatten()
            //only channels
            .map { it.channel }
            //send event
            .forEach { channel ->
                println("WRITING TO CHANNEL : ${channel.hashCode()} ->  ${msg.message.topic}")
                channel.send(msg)
            }
    }
}