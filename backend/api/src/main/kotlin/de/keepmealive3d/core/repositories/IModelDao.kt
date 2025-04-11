package de.keepmealive3d.core.repositories

import de.keepmealive3d.adapters.data.FileModelInfo
import de.keepmealive3d.adapters.data.ModelInfo
import de.keepmealive3d.adapters.data.ModelSettings

interface IModelDao {
    fun create(user: Int, model: FileModelInfo, settings: ModelSettings): Int?

    fun updateSettings(modelId: Int, settings: ModelSettings): Int

    fun getModelsOfUser(user: Int): List<ModelInfo>

    fun getModelById(id: Int): ModelInfo?

    fun getModelById(id: Int, userid: Int): ModelInfo?

    fun getModelSetting(id: Int): ModelSettings?

    fun delete(modelId: Int): Int
}