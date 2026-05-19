package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.ReplayLogComponent
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.repositories.IReplayComponentRepository
import io.ktor.server.plugins.NotFoundException
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface IReplayComponentService {
    fun addComponent(owner: Int, dt: Int, participant: Int, logId: Int, trace: String, type: String, additionalIdentifier: String)
    fun removeComponent(id: Int, owner: Int)
    fun getAllComponents(owner: Int, dt: Int, logId: Int, trace: String): List<ReplayLogComponent>
}

class ReplayComponentService: IReplayComponentService, KoinComponent {
    private val repo: IReplayComponentRepository by inject()

    override fun addComponent(
        owner: Int,
        dt: Int,
        participant: Int,
        logId: Int,
        trace: String,
        type: String,
        additionalIdentifier: String
    ) {
        repo.add(dt, owner, logId, trace, participant, type, additionalIdentifier)
    }

    override fun removeComponent(id: Int, owner: Int) {
        val component = repo.get(id) ?: throw NotFoundException("Component with id $id not found")
        if(component.owner == owner) {
            repo.delete(id)
        } else {
            throw InvalidAuthTokenException("Invalid token to delete this entity.")
        }
    }

    override fun getAllComponents(
        owner: Int,
        dt: Int,
        logId: Int,
        trace: String
    ): List<ReplayLogComponent> {
        return repo.getAllComponents(dt, logId, trace)
    }
}