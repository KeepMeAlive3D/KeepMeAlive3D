package de.keepmealive3d.adapters.sql.tables

import de.keepmealive3d.core.model.messages.MessageType
import org.ktorm.entity.Entity
import org.ktorm.schema.*
import java.time.Instant

interface DBEventEntity : Entity<DBEventEntity> {
    companion object : Entity.Factory<DBEventEntity>()

    val id: Int
    val type: MessageType
    val timestamp: Instant
    val source: String
    val topic: String
    val data: String
}

object DBEventTable : Table<DBEventEntity>("events") {
    val id = int("id").primaryKey().bindTo { it.id }
    val type = enum<MessageType>("type").bindTo { it.type }
    val timestamp = timestamp("timestamp").bindTo { it.timestamp }
    val source = varchar("source").bindTo { it.source }
    val topic = varchar("topic").bindTo { it.topic }
    val data = varchar("data").bindTo { it.data }
}
