package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int

object DBKmaMigrationsTable: Table<DKmaMigrationsEntity>("migrations") {
    val id = int("id").primaryKey().bindTo { it.id }
    val internalId = int("internal_id").bindTo { it.internalId }
}

interface DKmaMigrationsEntity: Entity<DKmaMigrationsEntity> {
    companion object : Entity.Factory<DKmaMigrationsEntity>()

    val id: Int
    val internalId: Int
}
