package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBDigitalTwinTable
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.exceptions.PersistenceException
import de.keepmealive3d.core.model.dt.DigitalTwinCreateDocument
import de.keepmealive3d.core.model.dt.DigitalTwinDocument
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

interface IDigitalTwinRepository {
    fun createDt(dt: DigitalTwinCreateDocument): DigitalTwinDocument
    fun updateDt(dt: DigitalTwinDocument): DigitalTwinDocument
    fun deleteDt(dt: Int)
    fun getDt(dt: Int): DigitalTwinDocument
    fun getAll(owner: Int): List<DigitalTwinDocument>
}

class DigitalTwinRepository : KoinComponent, IDigitalTwinRepository {
    private val kmaDatabase: KmaSqlDatabase by inject()

    override fun createDt(dt: DigitalTwinCreateDocument): DigitalTwinDocument {
        val id = kmaDatabase.database.insertAndGenerateKey(DBDigitalTwinTable) {
            set(it.owner, dt.owner)
            set(it.name, dt.name)
            set(it.icon, dt.icon)
        }.toString().toIntOrNull() ?: throw PersistenceException("Couldn't create digital twin")

        return DigitalTwinDocument(
            id = id,
            dt.owner,
            dt.name,
            dt.icon,
        )
    }

    override fun updateDt(dt: DigitalTwinDocument): DigitalTwinDocument {
        kmaDatabase.database.update(DBDigitalTwinTable) {
            set(it.owner, dt.owner)
            set(it.name, dt.name)
            set(it.icon, dt.icon)
        }
        return dt
    }

    override fun deleteDt(dt: Int) {
        kmaDatabase.database.delete(DBDigitalTwinTable) { it.id eq dt }
    }

    override fun getDt(dt: Int): DigitalTwinDocument {
        val entity = kmaDatabase.database.sequenceOf(DBDigitalTwinTable).filter { it.id eq dt }.firstOrNull()
            ?: throw EntityNotFoundException("Could not find digital twin!")
        return DigitalTwinDocument(
            id = entity.id,
            name = entity.name,
            owner = entity.owner,
            icon = entity.icon,
        )
    }

    override fun getAll(owner: Int): List<DigitalTwinDocument> {
        return kmaDatabase.database.sequenceOf(DBDigitalTwinTable).filter { it.owner eq owner }.map {
            DigitalTwinDocument(
                id = it.id,
                name = it.name,
                icon = it.icon,
                owner = it.owner,
            )
        }
    }
}