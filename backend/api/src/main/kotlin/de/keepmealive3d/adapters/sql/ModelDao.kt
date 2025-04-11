package de.keepmealive3d.adapters.sql

import de.keepmealive3d.adapters.data.FileModelInfo
import de.keepmealive3d.adapters.data.ModelInfo
import de.keepmealive3d.adapters.data.ModelSettings
import de.keepmealive3d.adapters.sql.tables.DBModelTable
import de.keepmealive3d.core.repositories.IModelDao
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.dsl.*
import org.ktorm.entity.filter
import org.ktorm.entity.find
import org.ktorm.entity.map
import org.ktorm.entity.sequenceOf

class ModelDao : KoinComponent, IModelDao {
    private val kmaDatabase: KmaSqlDatabase by inject()

    override fun create(user: Int, model: FileModelInfo, settings: ModelSettings): Int? {
        return kmaDatabase.database.insertAndGenerateKey(DBModelTable) {
            set(it.owner, user)
            set(it.filename, model.filename)
            set(it.modeName, model.model)
            set(it.lightIntensity, settings.lightIntensity)
            set(it.scale, settings.scale)
        }.toString().toIntOrNull()
    }

    override fun updateSettings(modelId: Int, settings: ModelSettings): Int {
        return kmaDatabase.database.update(DBModelTable) {
            set(it.lightIntensity, settings.lightIntensity)
            set(it.scale, settings.scale)
            where { it.id eq modelId }
        }
    }

    override fun getModelsOfUser(user: Int): List<ModelInfo> {
        return kmaDatabase
            .database
            .sequenceOf(DBModelTable)
            .filter { it.owner eq user }
            .map { ModelInfo(it.id, it.filename, it.modelName) }
    }

    override fun getModelById(id: Int): ModelInfo? {
        kmaDatabase.database.sequenceOf(DBModelTable).find { it.id eq id }?.let {
            return ModelInfo(it.id, it.filename, it.modelName)
        }
        return null
    }

    override fun getModelById(id: Int, userid: Int): ModelInfo? {
        kmaDatabase.database.sequenceOf(DBModelTable).find { (it.id eq id) and (it.owner eq userid) }?.let {
            return ModelInfo(it.id, it.filename, it.modelName)
        }
        return null
    }

    override fun getModelSetting(id: Int): ModelSettings? {
        kmaDatabase.database.sequenceOf(DBModelTable).find { it.id eq id }?.let {
            return ModelSettings(it.lightIntensity, it.scale)
        }
        return null
    }

    override fun delete(modelId: Int): Int {
        return kmaDatabase.database.delete(DBModelTable) { it.id eq modelId }
    }
}