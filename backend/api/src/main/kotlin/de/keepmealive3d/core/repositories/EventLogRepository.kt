package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.adapters.data.EventLogInfo
import de.keepmealive3d.adapters.data.EventLogInfoAll
import de.keepmealive3d.adapters.data.EventLogRefInfo
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBEventLogRefTable
import de.keepmealive3d.adapters.sql.tables.DBEventLogTable
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.insertAndGenerateKey
import org.ktorm.entity.filter
import org.ktorm.entity.firstOrNull
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

interface IEventLogRepository {
    fun createNewEventLog(owner: Int, dt: Int, name: String): EventLogInfo
    fun addEventLogData(
        dt: Int,
        name: String,
        owner: Int,
        eventLog: EventLog,
        refId: Int,
        type: EventLogTableType,
        typeId: String
    )

    fun getEventLogData(id: Int): EventLogRefInfo?
    fun getEventLogsByRef(refId: Int): List<EventLogRefInfo>
    fun getAllEventLogs(dt: Int): List<EventLogInfoAll>
    fun deleteEventLog(id: Int)
    fun deleteEventLogRef(refId: Int)
}

class EventLogRepository : KoinComponent, IEventLogRepository {
    val database: KmaSqlDatabase by inject()

    override fun createNewEventLog(
        owner: Int,
        dt: Int,
        name: String
    ): EventLogInfo {
        val id = database.database.insertAndGenerateKey(DBEventLogRefTable) {
            set(it.dt, dt)
            set(it.name, name)
            set(it.owner, owner)
        }
        return EventLogInfo(
            id as Int,
            name,
            owner,
            dt
        )
    }

    override fun addEventLogData(
        dt: Int,
        name: String,
        owner: Int,
        eventLog: EventLog,
        refId: Int,
        type: EventLogTableType,
        typeId: String
    ) {
        database.database.insert(DBEventLogTable) {
            set(it.name, name)
            set(it.ref, refId)
            set(it.dt, dt)
            set(it.owner, owner)
            set(it.data, Json.encodeToString(eventLog))
            set(it.type, type)
            set(it.typeId, typeId)
        }
    }

    override fun getEventLogData(id: Int): EventLogRefInfo? {
        val entity = database.database.sequenceOf(DBEventLogTable).firstOrNull { it.id eq id } ?: return null
        return EventLogRefInfo(
            id = entity.id,
            owner = entity.owner,
            dt = entity.dt,
            eventLog = Json.decodeFromString(entity.data),
            refId = entity.ref,
            type = entity.type,
            typeId = entity.typeId
        )
    }

    override fun getEventLogsByRef(refId: Int): List<EventLogRefInfo> {
        return database.database.sequenceOf(DBEventLogTable).filter { it.ref eq refId }.map {
            EventLogRefInfo(
                id = it.id,
                owner = it.owner,
                dt = it.dt,
                eventLog = Json.decodeFromString(it.data),
                refId = it.ref,
                type = it.type,
                typeId = it.typeId
            )
        }
    }

    override fun getAllEventLogs(dt: Int): List<EventLogInfoAll> {
        val logs = database.database.sequenceOf(DBEventLogRefTable).filter { it.dt eq dt }.map {
            EventLogInfo(
                id = it.id,
                owner = it.owner,
                dt = it.dt,
                name = it.name,
            )
        }
        val allRefLogs = database.database.sequenceOf(DBEventLogTable).filter { it.dt eq dt }.map {
            EventLogRefInfo(
                id = it.id,
                owner = it.owner,
                dt = it.dt,
                eventLog = Json.decodeFromString(it.data),
                refId = it.ref,
                type = it.type,
                typeId = it.typeId
            )
        }

        return logs.map { e ->
            EventLogInfoAll(
                id = e.id,
                owner = e.owner,
                dt = e.dt,
                name = e.name,
                refs = allRefLogs.filter { it.refId == e.id }
            )
        }
    }

    override fun deleteEventLog(id: Int) {
        database.database.delete(DBEventLogTable) {
            it.id eq id
        }
    }

    override fun deleteEventLogRef(refId: Int) {
        database.database.delete(DBEventLogTable) {
            it.ref eq refId
        }
        database.database.delete(DBEventLogRefTable) {
            it.id eq refId
        }
    }
}