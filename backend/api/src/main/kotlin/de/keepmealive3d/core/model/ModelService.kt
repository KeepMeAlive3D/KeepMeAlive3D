package de.keepmealive3d.core.model

import de.keepmealive3d.adapters.data.FileModelInfo
import de.keepmealive3d.adapters.data.ModelInfo
import de.keepmealive3d.adapters.data.ModelSettings
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.persistence.IModelDao
import de.keepmealive3d.core.persistence.IModelRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.nio.file.Path

class ModelService : IModelService, KoinComponent {
    private val modelRepository: IModelRepository by inject()
    private val modelDao: IModelDao by inject()

    override fun createNewModel(userid: Int, model: String, filename: String, fileBytes: ByteArray) {
        val path = modelRepository.createUniqueFileLocation(userid, model, filename)
        path.toFile().writeBytes(fileBytes)
        modelDao.create(userid, FileModelInfo(filename, model), ModelSettings(1.0, 1.0))
    }

    override fun getAllModels(userid: Int): List<ModelInfo> {
        val modelFiles = modelRepository.getAllModelFileNames(userid)
        val modelDb = modelDao.getModelsOfUser(userid)
        val models = modelFiles.mapNotNull { file ->
            modelDb.find { db -> db.filename == file.filename && db.model == file.model } ?: run {
                //migrate models without db entry
                val newId = modelDao.create(userid, file, ModelSettings(1.0, 1.0))
                modelDb.find { db -> db.modelId == newId }
            }
        }

        return models
    }

    override fun getSettings(modelId: Int): ModelSettings? {
        return modelDao.getModelSetting(modelId)
    }

    override fun updateSettings(modelId: Int, settings: ModelSettings) {
        modelDao.updateSettings(modelId, settings)
    }

    override fun getRequiredModelLocation(modelId: Int, userid: Int): Path {
        val model =
            modelDao.getModelById(modelId) ?: throw EntityNotFoundException("Model with id '$modelId' not found.")

        return modelRepository.getModelLocation(userid, model.model, model.filename)
            ?: throw EntityNotFoundException("Model file with id '$modelId' not found.")
    }

    override fun deleteModel(modelId: Int, userid: Int) {
        val model =
            modelDao.getModelById(modelId) ?: throw EntityNotFoundException("Model with id '$modelId' not found.")

        if (!modelRepository.deleteFile(userid, model.model, model.filename)) {
            throw EntityNotFoundException("Model file with id '$modelId' not found + $model.")
        }
    }

}