package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class AvailableFiles(
    val files: Set<ModelInfo>
)

@Serializable
data class FileModelInfo(
    val filename: String,
    val model: String
)

@Serializable
data class ModelInfo(
    val modelId: Int,
    val filename: String,
    val model: String
)