package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

interface DBBpmFilesEntity : Entity<DBBpmFilesEntity> {
    companion object : Entity.Factory<DBBpmFilesEntity>()

    val id: Int
    val owner: Int
    val dtId: Int
    val fileName: String
}

object DBBpmFilesTable : Table<DBBpmFilesEntity>("bpm_files") {
    val id = int("id").primaryKey().bindTo { it.id }
    val owner = int("owner").bindTo { it.owner }
    val dtId = int("dt").bindTo { it.dtId }
    val fileName = varchar("fileName").bindTo { it.fileName }
}
