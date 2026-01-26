package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.ReplayLogComponent
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBReplayComponentTable
import io.ktor.server.plugins.NotFoundException
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.and
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.filter
import org.ktorm.entity.firstOrNull
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

interface IReplayComponentRepository {
    fun getAllComponents(dt: Int, eventLog: Int, logId: Int, trace: String): List<ReplayLogComponent>
    fun add(dt: Int, owner: Int, logId: Int, trace: String, participantId: Int, type: String, additionalIdentifier: String)
    fun delete(id: Int)
    fun get(id: Int): ReplayLogComponent?
}

class ReplayComponentRepository : KoinComponent, IReplayComponentRepository {
    private val kmaSqlDatabase: KmaSqlDatabase by inject()

    override fun getAllComponents(
        dt: Int,
        eventLog: Int,
        logId: Int,
        trace: String
    ): List<ReplayLogComponent> {
        return kmaSqlDatabase
            .database
            .sequenceOf(DBReplayComponentTable)
            .filter { (it.dt eq dt) and (it.trace eq trace) and (it.logId eq logId) }.map {
                ReplayLogComponent(
                    id = it.id,
                    dt = it.dt,
                    owner = it.owner,
                    logId = it.logId,
                    trace = it.trace,
                    participantId = it.participant,
                    type = it.type,
                    additionalIdentifier = it.additionalIdentifier,
                )
            }
    }

    override fun add(
        dt: Int,
        owner: Int,
        logId: Int,
        trace: String,
        participantId: Int,
        type: String,
        additionalIdentifier: String
    ) {
        kmaSqlDatabase.database.insert(DBReplayComponentTable) {
            set(it.dt, dt)
            set(it.owner, owner)
            set(it.logId, logId)
            set(it.trace, trace)
            set(it.participant, participantId)
            set(it.type, type)
            set(it.additionalIdentifier, additionalIdentifier)
        }
    }

    override fun delete(id: Int) {
        val records = kmaSqlDatabase.database.delete(DBReplayComponentTable) { it.dt eq id }
        if (records == 0)
            throw NotFoundException("Component with id $id not found")
    }

    override operator fun get(id: Int): ReplayLogComponent? {
        return kmaSqlDatabase.database.sequenceOf(DBReplayComponentTable).firstOrNull { it.id eq id }?.let {
            ReplayLogComponent(
                it.id,
                it.dt,
                it.owner,
                it.logId,
                it.trace,
                it.participant,
                it.type,
                it.additionalIdentifier
            )
        }
    }
}