package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.adapters.sql.tables.DBEventTable
import de.keepmealive3d.core.model.messages.*
import de.keepmealive3d.core.model.session.ReplayState
import de.keepmealive3d.core.model.session.WsSessionData
import kotlinx.coroutines.delay
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.map
import java.time.Instant

interface IReplayService {
    suspend fun startReplay(sessionData: WsSessionData, start: Instant, stop: Instant)
}

class ReplayService: IReplayService, KoinComponent {
    private val eventRepository: EventDao by inject()

    override suspend fun startReplay(
        sessionData: WsSessionData,
        start: Instant,
        stop: Instant
    ) {
        val topics = sessionData.channels.map { channel -> channel.topic }
        val dataPoints = eventRepository.loadEvents(topics, start, stop).map {
            when (it[DBEventTable.type]) {
                MessageType.TOPIC_DATAPOINT -> DataPointMessageEvent(
                    Manifest(1, MessageType.TOPIC_DATAPOINT, it[DBEventTable.timestamp]),
                    DataPointMessageData(
                        it[DBEventTable.topic] ?: "",
                        it[DBEventTable.source] ?: "",
                        it[DBEventTable.data]?.toDoubleOrNull() ?: 0.0
                    )
                )
                MessageType.ANIMATION_RELATIVE -> RelativePositionMessageEvent(
                    Manifest(1, MessageType.ANIMATION_RELATIVE, it[DBEventTable.timestamp]),
                    RelativePositionMessageData(
                        it[DBEventTable.topic] ?: "",
                        it[DBEventTable.source] ?: "",
                        it[DBEventTable.data]?.toDoubleOrNull() ?: 0.0
                    )
                )
                else -> null
            }
        }.filterNotNull()

        for (i in dataPoints.indices) {
            if(sessionData.replayState != ReplayState.RUNNING) {
                return
            }
            val current = dataPoints[i]
            sessionData.channels.filter { it.topic == current.message.topic }.forEach { topicChannel ->
                topicChannel.channel.send(current)
            }
            try {
                val next = dataPoints[i + 1]
                val wait = next.manifest.timestamp!!.toEpochMilli() - current.manifest.timestamp!!.toEpochMilli()
                delay(wait)
            } catch (_: Exception) { }
        }
    }
}