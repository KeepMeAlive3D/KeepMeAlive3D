package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.*
import java.time.Instant

interface DBModelEntity : Entity<DBModelEntity> {
    companion object : Entity.Factory<DBModelEntity>()

    val id: Int
    val filename: String
    val modelName: String
    val owner: Int
    val createdAt: Instant
    val lightIntensity: Double
    val scale: Double
}

object DBModelTable : Table<DBModelEntity>("models") {
    val id = int("id").primaryKey().bindTo { it.id }
    val filename = varchar("filename").bindTo { it.filename }
    val modeName = varchar("model_name").bindTo { it.modelName }
    val owner = int("owner").bindTo { it.owner }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
    val lightIntensity = double("light_intensity").bindTo { it.lightIntensity }
    val scale = double("scale").bindTo { it.scale }
}
