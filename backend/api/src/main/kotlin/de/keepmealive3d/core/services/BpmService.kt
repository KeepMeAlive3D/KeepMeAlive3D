package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.BpmFileInfo
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.repositories.IBpmFilesRepository
import kotlinx.coroutines.coroutineScope
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.io.File
import kotlin.io.path.Path

interface IBpmService {
    suspend fun save(fileBytes: ByteArray, fileName: String, owner: Int, dtId: Int)
    fun getAll(dtId: Int, owner: Int): List<BpmFileInfo>
    fun get(dtId: Int, id: Int, owner: Int): BpmFileInfo
    fun download(dtId: Int, owner: Int, id: Int): File
    fun delete(owner: Int, id: Int)
    fun setActiveStates(id: Int, states: List<String>)
    fun getActiveStates(id: Int): List<String>
}

class BpmService : KoinComponent, IBpmService {
    private val repo: IBpmFilesRepository by inject()
    private val activeStates = hashMapOf<Int, MutableList<String>>()

    override suspend fun save(fileBytes: ByteArray, fileName: String, owner: Int, dtId: Int) {
        val id = repo.create(fileName, dtId, owner)
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dtId.toString())
            .resolve("bpm").resolve(id.toString())
        if (!p.toFile().exists()) {
            coroutineScope {
                p.toFile().parentFile.mkdirs()
                p.toFile().createNewFile()
            }
        }
        p.toFile().writeBytes(fileBytes)
    }

    override fun getAll(dtId: Int, owner: Int): List<BpmFileInfo> {
        return repo.getAll(dtId).filter { it.owner == owner }
    }

    override fun get(dtId: Int, id: Int, owner: Int): BpmFileInfo {
        val entity = repo.get(id)
        if(entity.owner == owner) {
            return entity
        }
        throw EntityNotFoundException("Entity with id $id not found")
    }

    override fun download(dtId: Int, owner: Int, id: Int): File {
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dtId.toString())
            .resolve("bpm").resolve(id.toString())
        if(p.toFile().exists()) {
            return p.toFile()
        }
        throw EntityNotFoundException("Could not find requested BPM file")
    }

    override fun delete(owner: Int, id: Int) {
        val entity = repo.get(id)
        if(entity.owner == owner) {
            repo.delete(entity.id)
            val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(entity.dtId.toString())
                .resolve("bpm").resolve(id.toString())
            if(p.toFile().exists()) {
                p.toFile().delete()
            }
        }
        throw EntityNotFoundException("Could not delete requested BPM file")
    }

    override fun setActiveStates(id: Int, states: List<String>) {
        activeStates[id] = states.toMutableList()
    }

    override fun getActiveStates(id: Int): List<String> {
        return activeStates[id] ?: emptyList()
    }
}