package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.StateMachineTrace
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBStateMachineTraceTable
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.filter
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

interface IStateMachineTraceRepository {
    fun getByEventLogTrace(refId: Int, traceId: String): List<StateMachineTrace>
    fun addTraceEntry(
        refId: Int,
        traceId: String,
        stateMachineId: Int,
        stateId: String,
        duration: Long
    )
}

class StateMachineTraceRepository : KoinComponent, IStateMachineTraceRepository {
    private val kmaSqlDatabase: KmaSqlDatabase by inject()

    override fun getByEventLogTrace(refId: Int, traceId: String): List<StateMachineTrace> {
        return kmaSqlDatabase.database.sequenceOf(DBStateMachineTraceTable)
            .filter { (it.refId eq refId) and (it.trace eq traceId) }
            .map {
                StateMachineTrace(
                    it.id,
                    it.refId,
                    it.trace,
                    it.stateMachineId,
                    it.stateId,
                    it.execDuration
                )
            }
    }

    override fun addTraceEntry(
        refId: Int,
        traceId: String,
        stateMachineId: Int,
        stateId: String,
        duration: Long
    ) {
        kmaSqlDatabase.database.insert(DBStateMachineTraceTable) {
            set(it.refId, refId)
            set(it.trace, traceId)
            set(it.stateMachineId, stateMachineId)
            set(it.stateId, stateId)
            set(it.execDuration, duration)
        }
    }
}