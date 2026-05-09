package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.ProcessParticipantCreate
import de.keepmealive3d.adapters.data.ProcessParticipantInfo
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.model.dt.ProcessParticipantCreateDocument
import de.keepmealive3d.core.model.dt.ProcessParticipantDocument
import de.keepmealive3d.core.repositories.IProcessParticipantRepository
import de.keepmealive3d.core.repositories.IReplayComponentRepository
import de.keepmealive3d.core.repositories.IStateChartRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface IProcessParticipantService {
    fun create(data: ProcessParticipantCreate, dtId: Int, owner: Int): ProcessParticipantInfo
    fun get(id: Int, dtId: Int, owner: Int): ProcessParticipantInfo
    fun getAll(dtId: Int, owner: Int): List<ProcessParticipantInfo>
    fun update(data: ProcessParticipantInfo, dtId: Int, owner: Int): ProcessParticipantInfo
    fun delete(id: Int, dtId: Int, owner: Int)
}

class ProcessParticipantService : KoinComponent, IProcessParticipantService {
    private val repository: IProcessParticipantRepository by inject()
    private val stateMachineRepository: IStateChartRepository by inject()
    private val replayComponentRepository: IReplayComponentRepository by inject()

    override fun create(data: ProcessParticipantCreate, dtId: Int, owner: Int): ProcessParticipantInfo {
        val doc = repository.create(ProcessParticipantCreateDocument(owner, dtId, data.name, data.icon))
        return ProcessParticipantInfo(doc.id, doc.name, doc.icon)
    }

    override fun get(id: Int, dtId: Int, owner: Int): ProcessParticipantInfo {
        val doc = repository.get(id)
        if (doc.owner == owner) {
            return ProcessParticipantInfo(doc.id, doc.name, doc.icon)
        }
        throw EntityNotFoundException("Process Participant not found!")
    }

    override fun getAll(
        dtId: Int,
        owner: Int
    ): List<ProcessParticipantInfo> {
        val doc = repository.getAll(dtId)
        return doc.filter { it.owner == owner }.map {
            ProcessParticipantInfo(
                it.id,
                it.name,
                it.icon
            )
        }
    }

    override fun update(data: ProcessParticipantInfo, dtId: Int, owner: Int): ProcessParticipantInfo {
        val doc = repository.get(data.id)
        if(doc.owner == owner && doc.dt == dtId) {
            repository.update(ProcessParticipantDocument(data.id, owner, dtId, data.name, data.icon))
            return data
        }
        throw EntityNotFoundException("Process Participant not found!")
    }

    override fun delete(id: Int, dtId: Int, owner: Int) {
        val doc = repository.get(id)
        if(doc.owner == owner && doc.dt == dtId) {
            repository.delete(id)
            val sms = stateMachineRepository.getStateMachines(id)
            sms.forEach {
                stateMachineRepository.deleteStateMachine(it.id)
                replayComponentRepository.deleteByParticipant(it.id)

            }
            replayComponentRepository.deleteByParticipant(id)
            return
        }
        throw EntityNotFoundException("Process Participant not found!")
    }
}