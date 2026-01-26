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
import org.slf4j.LoggerFactory
import java.util.*
import kotlin.collections.map

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
    private val eventLogReplayService: IEventLogReplayService by inject()
    private val jwt: JWT by inject()
    private val logger = LoggerFactory.getLogger("WsSessionService")
    private val topicChannels = mutableMapOf<String, MutableList<Channel<GenericMessageEvent>>>()

    override fun newSession(info: Manifest): Result<WsSessionData> {
        val uuid = try {
            UUID.fromString(info.uuid)
        } catch (_: Exception) {
            return Result.failure(BadRequestDataException("Invalid session UUID"))
        }
        logger.info("Creating new Websocket session $uuid")
        val wsSessionData = WsSessionData(
            uuid = uuid,
            channels = mutableListOf()
        )
        sessions.add(wsSessionData)
        return Result.success(wsSessionData)
    }

    override fun closeSession(uuid: String?, topic: String?): Result<Unit> {
        logger.info("Closing websocket session $uuid")
        val wsSession = sessions.find { it.uuid.toString() == uuid } ?: return Result.failure(
            EntityNotFoundException("The session could not be found")
        )
        topicChannels[topic]?.let { channels ->
            channels.removeAll { c -> wsSession.channels.filter { it.topic == topic }.map { it.channel }.contains(c) }
        }
        wsSession.channels.filter { it.topic == topic }.forEach { it.channel.close() }
        wsSession.channels.removeAll { it.topic == topic }
        if (wsSession.channels.isEmpty()) {
            sessions.remove(wsSession)
        }
        return Result.success(Unit)
    }

    override fun topicSubscribe(info: SubscribeEvent): Result<Channel<GenericMessageEvent>> {
        logger.info("Subscribe to topic: ${info.message.topic}")
        val wsSession =
            sessions.find { it.uuid.toString() == info.manifest.uuid } ?: newSession(info.manifest).getOrElse {
                return Result.failure(it)
            }
        val channel = Channel<GenericMessageEvent>()
        val wsChannelData = WsSessionChannelData(info.message.topic, channel)
        topicChannels[info.message.topic]?.add(channel) ?: run {
            topicChannels[info.message.topic] = mutableListOf(channel)
        }
        wsSession.channels.add(wsChannelData)
        return Result.success(channel)
    }

    override suspend fun startReplay(info: ReplayStartEvent): Result<Unit> {
        logger.info("Start Replay")
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err ->
                logger.warn("The user id could not be found")
                return Result.failure(err)
            }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        val topic = "replay-${info.logId}-${info.trace}"
        eventLogReplayService.startReplay(getAllChannelsForTopic(topic), userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override suspend fun pauseReplay(info: ReplayPauseEvent): Result<Unit> {
        logger.info("Pause Replay")
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err -> return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        val topic = "replay-${info.logId}-${info.trace}"
        eventLogReplayService.pauseReplay(getAllChannelsForTopic(topic), userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override fun endReplay(info: ReplayEndEvent): Result<Unit> {
        logger.info("End Replay")
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err -> return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        eventLogReplayService.end(userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    override suspend fun forwardReplay(info: ReplayForwardEvent): Result<Unit> {
        logger.info("Forward Replay")
        val userid = info.manifest.bearerToken?.let {
            jwt.getUserId(it).getOrElse { err -> return Result.failure(err) }
        } ?: return Result.failure(InvalidAuthTokenException("Invalid bearer token"))

        val topic = "replay-${info.logId}-${info.trace}"
        eventLogReplayService.stepForward(getAllChannelsForTopic(topic), userid, info.dtId, info.logId, info.trace)
        return Result.success(Unit)
    }

    private fun getAllChannelsForTopic(topic: String): MutableList<Channel<GenericMessageEvent>> {
        topicChannels[topic]?.let { return it }

        val list = mutableListOf<Channel<GenericMessageEvent>>()
        topicChannels[topic] = list
        return list
    }

    override suspend fun distributeLiveEvent(msg: GenericMessageEvent) {
        getAllChannelsForTopic(msg.message.topic).forEach { channel ->
            println("WRITING TO CHANNEL : ${channel.hashCode()} ->  ${msg.message.topic}")
            channel.send(msg)
        }
    }
}