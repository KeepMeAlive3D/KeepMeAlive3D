package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class ModelSettings(
    val lightIntensity: Double,
    val scale: Double,
)