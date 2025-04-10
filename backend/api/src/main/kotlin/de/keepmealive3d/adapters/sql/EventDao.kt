package de.keepmealive3d.adapters.sql

import de.keepmealive3d.adapters.sql.tables.DBEventTable
import de.keepmealive3d.core.model.messages.DataPointMessageEvent
import de.keepmealive3d.core.model.messages.DataPointMessageData
import de.keepmealive3d.core.model.messages.ErrorEvent
import de.keepmealive3d.core.model.messages.EventErrorData
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import de.keepmealive3d.core.model.messages.Manifest
import de.keepmealive3d.core.model.messages.MessageType
import de.keepmealive3d.core.model.messages.RelativePositionMessageEvent
import de.keepmealive3d.core.model.messages.RelativePositionMessageData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier
import org.ktorm.dsl.Query
import org.ktorm.dsl.and
import org.ktorm.dsl.asc
import org.ktorm.dsl.eq
import org.ktorm.dsl.from
import org.ktorm.dsl.greaterEq
import org.ktorm.dsl.inList
import org.ktorm.dsl.insert
import org.ktorm.dsl.lessEq
import org.ktorm.dsl.orderBy
import org.ktorm.dsl.select
import org.ktorm.dsl.where
import org.ktorm.entity.filter
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf
import org.ktorm.entity.sortedByDescending
import org.ktorm.entity.take
import java.time.Instant

class EventDao : KoinComponent {
    private val channel: Channel<GenericMessageEvent> by inject(qualifier = qualifier("events"))
    private val kmaDatabase: KmaSqlDatabase by inject()

    suspend fun saveEvents() = coroutineScope {
        launch {
            for (event in channel) {
                when (event.manifest.messageType) {
                    MessageType.TOPIC_DATAPOINT -> saveDbEvent(
                        event.manifest.messageType,
                        event.message.dataSource,
                        event.message.topic,
                        (event as DataPointMessageEvent).message.point.toString(),
                        event.manifest.timestamp
                    )

                    MessageType.ANIMATION_RELATIVE -> saveDbEvent(
                        event.manifest.messageType,
                        event.message.dataSource,
                        event.message.topic,
                        (event as RelativePositionMessageEvent).message.percentage.toString(),
                        event.manifest.timestamp
                    )

                    else -> {}
                }
            }
        }
    }

    private suspend fun saveDbEvent(
        type: MessageType,
        source: String,
        topic: String,
        data: String,
        timestamp: Instant?
    ) = coroutineScope {
        launch(Dispatchers.IO) {
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
    }

    fun loadEvents(source: String, topic: String, limit: Int): List<GenericMessageEvent> =
        kmaDatabase
            .database
            .sequenceOf(DBEventTable)
            .filter { (it.source eq source) and (it.topic eq topic) }
            .sortedByDescending { it.timestamp }
            .take(limit)
            .map {
                when (it.type) {
                    MessageType.TOPIC_DATAPOINT -> DataPointMessageEvent(
                        Manifest(1, MessageType.TOPIC_DATAPOINT, it.timestamp, null),
                        DataPointMessageData(it.topic, it.source, it.data.toDouble())
                    )

                    MessageType.ANIMATION_RELATIVE -> RelativePositionMessageEvent(
                        Manifest(1, MessageType.ANIMATION_RELATIVE, it.timestamp, null),
                        RelativePositionMessageData(it.topic, it.source, it.data.toDouble())
                    )

                    else -> ErrorEvent(
                        Manifest(1, MessageType.ERROR, it.timestamp, null),
                        EventErrorData("DB error", "Failed to load event message from db")
                    )
                }
            }

    fun loadEvents(topics: List<String>, from: Instant, to: Instant): Query {
        println("FROM: $from (${from.epochSecond}), TO: $to (${to.epochSecond})")
        return kmaDatabase
            .database
            .from(DBEventTable)
            .select()
            .where {
                (DBEventTable.topic inList topics.distinct()) and ((DBEventTable.timestamp greaterEq from) and (DBEventTable.timestamp lessEq to))
            }
            .orderBy(DBEventTable.timestamp.asc())
    }
}