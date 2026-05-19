package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.boolean
import org.ktorm.schema.int
import org.ktorm.schema.long
import org.ktorm.schema.text
import org.ktorm.schema.varchar

interface DBStateMachineTraceEntity : Entity<DBStateMachineTraceEntity> {
    companion object : Entity.Factory<DBStateMachineTraceEntity>()

    val id: Int
    val refId: Int
    val trace: String
    val stateMachineId: Int
    val stateId: String
    val execDuration: Long
}

object DBStateMachineTraceTable : Table<DBStateMachineTraceEntity>("state_machine_trace") {
    val id = int("id").primaryKey().bindTo { it.id }
    val refId = int("refId").bindTo { it.refId }
    val trace = varchar("trace").bindTo { it.trace }
    val stateMachineId = int("state_machine_id").bindTo { it.stateMachineId }
    val stateId = text("state_id").bindTo { it.stateId }
    val execDuration = long("exec_duration").bindTo { it.execDuration }
}