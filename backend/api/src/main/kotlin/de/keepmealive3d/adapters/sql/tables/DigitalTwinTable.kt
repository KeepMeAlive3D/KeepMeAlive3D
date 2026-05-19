package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

interface DBDigitalTwinEntity : Entity<DBDigitalTwinEntity> {
    companion object : Entity.Factory<DBDigitalTwinEntity>()

    val id: Int
    val owner: Int
    val name: String
    val icon: Int
}

object DBDigitalTwinTable : Table<DBDigitalTwinEntity>("digital_twins") {
    val id = int("id").primaryKey().bindTo { it.id }
    val owner = int("owner").bindTo { it.owner }
    val name = varchar("name").bindTo { it.name }
    val icon = int("icon").bindTo { it.icon }
}
