package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.DigitalTwinCreate
import de.keepmealive3d.adapters.data.DigitalTwinInfo
import de.keepmealive3d.core.model.dt.DigitalTwinCreateDocument
import de.keepmealive3d.core.model.dt.DigitalTwinDocument
import de.keepmealive3d.core.repositories.IDigitalTwinRepository
import io.ktor.server.plugins.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface IDigitalTwinService {
    fun getInfo(owner: Int, id: Int): DigitalTwinInfo
    fun getAll(owner: Int): List<DigitalTwinInfo>
    fun delete(owner: Int, id: Int)
    fun update(owner: Int, dt: DigitalTwinInfo)
    fun create(owner: Int, dt: DigitalTwinCreate): DigitalTwinInfo
}

class DigitalTwinService : KoinComponent, IDigitalTwinService {
    private val repository: IDigitalTwinRepository by inject()

    override fun getInfo(owner: Int, id: Int): DigitalTwinInfo {
        val info = repository.getDt(id)
        if(info.owner == owner) {
            return DigitalTwinInfo(
                id = info.id,
                name = info.name,
                icon = info.icon,
            )
        }
        throw NotFoundException("Could not find digital twin!") //throw not found to hide this info from an attacker
    }

    override fun getAll(owner: Int): List<DigitalTwinInfo> {
        return repository.getAll(owner).map {
            DigitalTwinInfo(
                id = it.id,
                name = it.name,
                icon = it.icon,
            )
        }
    }

    override fun delete(owner: Int, id: Int) {
        val info = repository.getDt(id)
        if(info.owner == owner) {
            repository.deleteDt(id)
        } else {
            throw NotFoundException("Could not find digital twin!")
        }
    }

    override fun update(owner: Int, dt: DigitalTwinInfo) {
        val info = repository.getDt(dt.id)
        if(info.owner == owner) {
            repository.updateDt(DigitalTwinDocument(info.id, info.owner, info.name, info.icon))
            return
        }
        throw NotFoundException("Could not update digital twin!")
    }

    override fun create(owner: Int, dt: DigitalTwinCreate): DigitalTwinInfo {
        val doc = repository.createDt(DigitalTwinCreateDocument(owner, dt.name, dt.icon))
        return DigitalTwinInfo(doc.id, doc.name, doc.icon)
    }
}