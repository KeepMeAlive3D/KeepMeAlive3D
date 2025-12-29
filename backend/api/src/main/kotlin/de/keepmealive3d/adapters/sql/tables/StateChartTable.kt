package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.text
import org.ktorm.schema.varchar

interface DBStateChartEntity : Entity<DBStateChartEntity> {
    companion object : Entity.Factory<DBStateChartEntity>()

    val id: Int
    val participant: Int
    val data: String
    val name: String
}

object DBStateChartTable : Table<DBStateChartEntity>("state_charts") {
    val id = int("id").primaryKey().bindTo { it.id }
    val participant = int("participant").bindTo { it.participant }
    val name = varchar("name").bindTo { it.name }
    val data = text("data").bindTo { it.data }
}