package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.BpmFileInfo
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBBpmFilesTable
import io.ktor.server.plugins.NotFoundException
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insertAndGenerateKey
import org.ktorm.entity.filter
import org.ktorm.entity.firstOrNull
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

interface IBpmFilesRepository {
    fun create(filename: String, dtId: Int, owner: Int): Int
    fun get(id: Int): BpmFileInfo
    fun getAll(dtId: Int): List<BpmFileInfo>
    fun delete(id: Int)
}

class BpmFilesRepository: KoinComponent, IBpmFilesRepository {
    private val kmaSqlDatabase: KmaSqlDatabase by inject()

    override fun create(filename: String, dtId: Int, owner: Int): Int {
        return kmaSqlDatabase.database.insertAndGenerateKey(DBBpmFilesTable) {
            set(it.dtId, dtId)
            set(it.owner, owner)
            set(it.fileName, filename)
        } as Int
    }

    override fun get(id: Int): BpmFileInfo {
        return kmaSqlDatabase.database.sequenceOf(DBBpmFilesTable).firstOrNull { it.id eq id }?.let {
            BpmFileInfo(
                it.id,
                it.dtId,
                it.owner,
                it.fileName,
            )
        } ?: throw NotFoundException("The Bpm File with ID $id not found")
    }

    override fun getAll(dtId: Int): List<BpmFileInfo> {
        return kmaSqlDatabase.database.sequenceOf(DBBpmFilesTable).filter { it.dtId eq dtId }.map {
            BpmFileInfo(
                it.id,
                it.dtId,
                it.owner,
                it.fileName,
            )
        }
    }

    override fun delete(id: Int) {
        kmaSqlDatabase.database.delete(DBBpmFilesTable) { it.id eq id }
    }
}