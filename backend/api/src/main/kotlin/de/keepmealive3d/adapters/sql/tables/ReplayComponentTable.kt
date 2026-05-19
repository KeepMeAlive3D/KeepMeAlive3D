package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

interface DBReplayComponentEntity : Entity<DBReplayComponentEntity> {
    companion object : Entity.Factory<DBReplayComponentEntity>()

    val id: Int
    val owner: Int
    val dt: Int
    val participant: Int
    val logId: Int
    val trace: String
    val type: String
    val additionalIdentifier: String
}

object DBReplayComponentTable : Table<DBReplayComponentEntity>("replay_component") {
    val id = int("id").primaryKey().bindTo { it.id }
    val owner = int("owner").bindTo { it.owner }
    val dt = int("dt").bindTo { it.dt }
    val participant = int("participant").bindTo { it.participant }
    val logId = int("logId").bindTo { it.logId }
    val trace = varchar("trace").bindTo { it.trace }
    val type = varchar("type").bindTo { it.type }
    val additionalIdentifier = varchar("additionalIdentifier").bindTo { it.additionalIdentifier }
}
