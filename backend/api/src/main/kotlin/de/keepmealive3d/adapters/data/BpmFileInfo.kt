package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class BpmFileInfo(
    val id: Int,
    val dtId: Int,
    val owner: Int,
    val fileName: String,
)