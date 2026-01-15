package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.adapters.data.EventLogInfo
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBEventLogTable
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.filter
import org.ktorm.entity.firstOrNull
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

interface IEventLogRepository {
    fun addEventLog(dt: Int, name: String, owner: Int, eventLog: EventLog)
    fun getEventLog(id: Int): EventLogInfo?
    fun getAllEventLogs(dt: Int): List<EventLogInfo>
    fun deleteEventLog(id: Int)
}

class EventLogRepository : KoinComponent, IEventLogRepository {
    val database: KmaSqlDatabase by inject()

    override fun addEventLog(dt: Int, name: String, owner: Int, eventLog: EventLog) {
        database.database.insert(DBEventLogTable) {
            set(it.name, name)
            set(it.dt, dt)
            set(it.owner, owner)
            set(it.data, Json.encodeToString(eventLog))
        }
    }

    override fun getEventLog(id: Int): EventLogInfo? {
        val entity = database.database.sequenceOf(DBEventLogTable).firstOrNull { it.id eq id } ?: return null
        return EventLogInfo(
            id = entity.id,
            owner = entity.owner,
            dt = entity.dt,
            eventLog = Json.decodeFromString(entity.data)
        )
    }

    override fun getAllEventLogs(dt: Int): List<EventLogInfo> {
        return database.database.sequenceOf(DBEventLogTable).filter { it.dt eq dt }.map {
            EventLogInfo(
                id = it.id,
                owner = it.owner,
                dt = it.dt,
                eventLog = Json.decodeFromString(it.data)
            )
        }
    }

    override fun deleteEventLog(id: Int) {
        database.database.delete(DBEventLogTable) {
            it.id eq id
        }
    }
}