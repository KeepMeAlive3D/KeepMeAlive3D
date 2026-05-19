package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBProgressParticipantTable
import de.keepmealive3d.core.exceptions.PersistenceException
import de.keepmealive3d.core.model.dt.ProcessParticipantCreateDocument
import de.keepmealive3d.core.model.dt.ProcessParticipantDocument
import io.ktor.server.plugins.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insertAndGenerateKey
import org.ktorm.dsl.update
import org.ktorm.entity.filter
import org.ktorm.entity.firstOrNull
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

interface IProcessParticipantRepository {
    fun create(processParticipant: ProcessParticipantCreateDocument): ProcessParticipantDocument
    fun delete(processParticipant: Int)
    fun update(processParticipant: ProcessParticipantDocument): ProcessParticipantDocument
    fun get(processParticipant: Int): ProcessParticipantDocument
    fun getAll(dt: Int): List<ProcessParticipantDocument>
}

class ProcessParticipantRepository : KoinComponent, IProcessParticipantRepository {
    private val kmaSqlDatabase: KmaSqlDatabase by inject()

    override fun create(processParticipant: ProcessParticipantCreateDocument): ProcessParticipantDocument {
        val key = kmaSqlDatabase.database.insertAndGenerateKey(DBProgressParticipantTable) {
            set(it.owner, processParticipant.owner)
            set(it.dt, processParticipant.dt)
            set(it.name, processParticipant.name)
            set(it.icon, processParticipant.icon)
        }.toString().toIntOrNull() ?: throw PersistenceException("Couldn't create Process Participant!")
        return ProcessParticipantDocument(
            id = key,
            owner = processParticipant.owner,
            name = processParticipant.name,
            icon = processParticipant.icon,
            dt = processParticipant.dt
        )
    }

    override fun delete(processParticipant: Int) {
        kmaSqlDatabase.database.delete(DBProgressParticipantTable) { it.id eq processParticipant }
    }

    override fun update(processParticipant: ProcessParticipantDocument): ProcessParticipantDocument {
        kmaSqlDatabase.database.update(DBProgressParticipantTable) {
            set(it.owner, processParticipant.owner)
            set(it.name, processParticipant.name)
            set(it.icon, processParticipant.icon)
            set(it.dt, processParticipant.dt)
        }
        return processParticipant
    }

    override fun get(processParticipant: Int): ProcessParticipantDocument {
        val entity =
            kmaSqlDatabase.database.sequenceOf(DBProgressParticipantTable).firstOrNull { it.id eq processParticipant }
                ?: throw NotFoundException("Process Participant not found!")
        return ProcessParticipantDocument(
            id = entity.id,
            owner = entity.owner,
            name = entity.name,
            icon = entity.icon,
            dt = entity.dt
        )
    }

    override fun getAll(dt: Int): List<ProcessParticipantDocument> {
        return kmaSqlDatabase.database.sequenceOf(DBProgressParticipantTable).filter { it.dt eq dt }.map {
            ProcessParticipantDocument(
                id = it.id,
                owner = it.owner,
                name = it.name,
                icon = it.icon,
                dt = it.dt
            )
        }
    }
}