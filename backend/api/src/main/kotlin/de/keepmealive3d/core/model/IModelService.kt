package de.keepmealive3d.core.model

import de.keepmealive3d.adapters.data.FileModelInfo
import de.keepmealive3d.adapters.data.ModelInfo
import de.keepmealive3d.adapters.data.ModelSettings
import java.nio.file.Path

interface IModelService {
    fun createNewModel(userid: Int, model: String, filename: String, fileBytes: ByteArray)
    fun getAllModels(userid: Int): List<ModelInfo>
    fun getSettings(modelId: Int): ModelSettings?
    fun updateSettings(modelId: Int, settings: ModelSettings)
    fun getRequiredModelLocation(modelId: Int, userid: Int): Path
    fun deleteModel(modelId: Int, userid: Int)
}