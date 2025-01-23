package de.keepmealive3d.adapters.sql

import de.keepmealive3d.adapters.sql.tables.DBEventTable
import de.keepmealive3d.core.event.messages.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier
import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.filter
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf
import org.ktorm.entity.take
import java.time.Instant

class EventDao : KoinComponent {
    private val channel: Channel<GenericEventMessage> by inject(qualifier = qualifier("events"))
    private val kmaDatabase: KmaSqlDatabase by inject()

    suspend fun saveEvents() = coroutineScope {
        launch {
            for (event in channel) {
                when (event.manifest.messageType) {
                    MessageType.TOPIC_DATAPOINT -> saveDbEvent(
                        event.manifest.messageType,
                        event.message.dataSource,
                        event.message.topic,
                        (event as DataPointEventMessage).message.point.toString(),
                        event.manifest.timestamp
                    )
                    MessageType.ANIMATION_POSITION -> saveDbEvent(
                        event.manifest.messageType,
                        event.message.dataSource,
                        event.message.topic,
                        Json.encodeToString((event as PositionEventMessage).message.position),
                        event.manifest.timestamp
                    )
                    else -> {}
                }
            }
        }
    }

    private fun saveDbEvent(type: MessageType, source: String, topic: String, data: String, timestamp: Instant?) {
        try {
            kmaDatabase.database.insert(DBEventTable) {
                set(it.type, type)
                set(it.source, source)
                set(it.topic, topic)
                set(it.data, data)
                set(it.timestamp, timestamp)
            }
        } catch (exception: Exception) {
            exception.printStackTrace()
        }
    }

    fun loadEvents(source: String, topic: String, limit: Int): List<GenericEventMessage> =
        kmaDatabase
            .database
            .sequenceOf(DBEventTable)
            .filter { (it.source eq source) and (it.topic eq topic) }
            .take(limit)
            .map {
                when (it.type) {
                    MessageType.TOPIC_DATAPOINT -> DataPointEventMessage(
                        Manifest(1, MessageType.TOPIC_DATAPOINT, it.timestamp, null),
                        DataPointMessageData(it.topic, it.source, it.data.toDouble())
                    )
                    MessageType.ANIMATION_POSITION -> PositionEventMessage(
                        Manifest(1, MessageType.ANIMATION_POSITION, it.timestamp, null),
                        PositionMessageData(it.topic, it.source, Json.decodeFromString(it.data))
                    )
                    else -> EventError(
                        Manifest(1, MessageType.ERROR, it.timestamp, null),
                        EventErrorData("DB error", "Failed to load event message from db")
                    )
                }
            }
}