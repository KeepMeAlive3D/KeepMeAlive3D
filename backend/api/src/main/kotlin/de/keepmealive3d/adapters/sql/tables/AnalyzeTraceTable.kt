package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.long
import org.ktorm.schema.text
import org.ktorm.schema.varchar

interface DBAnalyzeTraceEntity : Entity<DBAnalyzeTraceEntity> {
    companion object : Entity.Factory<DBAnalyzeTraceEntity>()

    val id: Int
    val refId: Int
    val trace: String
    val stateMachineId: Int
    val previousState: String
    val stateId: String
    val execDuration: Long
    val correlationEvent: String
}

object DBAnalyzeTraceTable : Table<DBAnalyzeTraceEntity>("analyze_trace") {
    val id = int("id").primaryKey().bindTo { it.id }
    val refId = int("ref_id").bindTo { it.refId }
    val trace = text("trace").bindTo { it.trace }
    val stateMachineId = int("state_machine_id").bindTo { it.stateMachineId }
    val previousState = text("previous_state").bindTo { it.previousState }
    val stateId = text("state_id").bindTo { it.stateId }
    val execDuration = long("exec_duration").bindTo { it.execDuration }
    val correlationEvent = text("correlation_event").bindTo { it.correlationEvent }
}
