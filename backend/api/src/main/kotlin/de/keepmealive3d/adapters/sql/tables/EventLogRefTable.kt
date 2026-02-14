package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

interface DBEventLogRefEntity : Entity<DBEventLogEntity> {
    companion object : Entity.Factory<DBEventLogEntity>()

    val id: Int
    val owner: Int
    val dt: Int
    val name: String
}

object DBEventLogRefTable : Table<DBEventLogEntity>("event_logs_ref") {
    val id = int("id").primaryKey().bindTo { it.id }
    val owner = int("owner").bindTo { it.owner }
    val dt = int("dt").bindTo { it.dt }
    val name = varchar("name").bindTo { it.name }
}
