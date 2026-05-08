package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBAnalyzeTraceEntity
import de.keepmealive3d.adapters.sql.tables.DBAnalyzeTraceTable
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.filter
import org.ktorm.entity.sequenceOf
import org.ktorm.entity.toList
import java.time.Instant

interface IAnalyzeTraceRepository {
    fun saveTransition(
        refId: Int,
        trace: String,
        stateMachineId: Int,
        previousState: String,
        stateId: String,
        execDuration: Long,
        correlationEvent: String,
        execTime: Instant,
        correlationEventId: String,
    )

    fun getTransition(refId: Int, stateMachineId: Int, trace: String): List<DBAnalyzeTraceEntity>
}

class AnalyzeTraceRepository : KoinComponent, IAnalyzeTraceRepository {
    private val kmaSqlDatabase: KmaSqlDatabase by inject()

    override fun saveTransition(
        refId: Int,
        trace: String,
        stateMachineId: Int,
        previousState: String,
        stateId: String,
        execDuration: Long,
        correlationEvent: String,
        execTime: Instant,
        correlationEventId: String,
    ) {
        kmaSqlDatabase.database.insert(DBAnalyzeTraceTable) {
            set(it.refId, refId)
            set(it.trace, trace)
            set(it.stateMachineId, stateMachineId)
            set(it.previousState, previousState)
            set(it.stateId, stateId)
            set(it.execDuration, execDuration)
            set(it.correlationEvent, correlationEvent)
            set(it.executionTime, execTime)
            set(it.correlationEventId, correlationEventId)
        }
    }

    override fun getTransition(
        refId: Int,
        stateMachineId: Int,
        trace: String
    ): List<DBAnalyzeTraceEntity> {
        return kmaSqlDatabase
            .database
            .sequenceOf(DBAnalyzeTraceTable)
            .filter { (it.trace eq trace) and (it.refId eq refId) and (it.stateMachineId eq stateMachineId) }
            .toList()
    }
}