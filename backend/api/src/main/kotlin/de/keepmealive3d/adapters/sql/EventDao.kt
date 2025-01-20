package de.keepmealive3d.adapters.sql

import de.keepmealive3d.adapters.sql.tables.DBEventTable
import de.keepmealive3d.core.event.messages.EventMessage
import de.keepmealive3d.core.event.messages.EventMessageData
import de.keepmealive3d.core.event.messages.Manifest
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
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

class EventDao : KoinComponent {
    private val channel: Channel<EventMessage> by inject(qualifier = qualifier("events"))
    private val kmaDatabase: KmaSqlDatabase by inject()

    suspend fun saveEvents() = coroutineScope {
        launch {
            for (event in channel) {
                try {
                    kmaDatabase.database.insert(DBEventTable) {
                        set(it.type, event.manifest.messageType)
                        set(it.source, event.message.dataSource)
                        set(it.topic, event.message.topic)
                        set(it.data, event.message.eventData)
                        set(it.timestamp, event.manifest.timestamp)
                    }
                } catch (exception: Exception) {
                    exception.printStackTrace()
                }
            }
        }
    }

    fun loadEvents(source: String, topic: String, limit: Int): List<EventMessage> =
        kmaDatabase
            .database
            .sequenceOf(DBEventTable)
            .filter { (it.source eq source) and (it.topic eq topic) }
            .take(limit)
            .map {
                EventMessage(
                    Manifest(1, it.type, it.timestamp),
                    EventMessageData(topic, source, Json.decodeFromString(it.data))
                )
            }
}