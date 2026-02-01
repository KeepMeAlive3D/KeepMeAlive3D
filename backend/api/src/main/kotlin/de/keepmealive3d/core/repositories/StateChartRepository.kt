package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.StateMachine
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBStateChartEntity
import de.keepmealive3d.adapters.sql.tables.DBStateChartTable
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update
import org.ktorm.entity.filter
import org.ktorm.entity.first
import org.ktorm.entity.sequenceOf
import org.ktorm.entity.toList

interface IStateChartRepository {
    fun createStateMachine(participant: Int, name: String, stateChartData: StateMachine)
    fun getStateMachines(participant: Int): List<DBStateChartEntity>
    fun getStateMachine(id: Int): StateMachine
    fun deleteStateMachine(id: Int)
    fun updateStateMachine(id: Int, stateMachine: StateMachine)
}

class StateChartRepository : IStateChartRepository, KoinComponent {
    val kmaDb: KmaSqlDatabase by inject()

    override fun createStateMachine(
        participant: Int,
        name: String,
        stateChartData: StateMachine
    ) {
        val data = Json.encodeToString(stateChartData)
        kmaDb.database.insert(DBStateChartTable) {
            set(it.participant, participant)
            set(it.name, name)
            set(it.data, data)
        }
    }

    override fun getStateMachines(participant: Int): List<DBStateChartEntity> {
        return kmaDb.database.sequenceOf(DBStateChartTable).filter { it.participant eq participant }.toList()
    }

    override fun getStateMachine(id: Int): StateMachine {
        val entity = kmaDb.database.sequenceOf(DBStateChartTable).first { it.id eq id }
        return Json.decodeFromString<StateMachine>(entity.data)
    }

    override fun deleteStateMachine(id: Int) {
        kmaDb.database.delete(DBStateChartTable) { it.id eq id }
    }

    override fun updateStateMachine(id: Int, stateMachine: StateMachine) {
        kmaDb.database.update(DBStateChartTable) {
            set(it.data, Json.encodeToString(stateMachine))
            where { it.id eq id }
        }
    }
}