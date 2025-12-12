package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class DigitalTwinInfo(
    val id: Int,
    val name: String,
    val icon: Int,
)
@Serializable
data class DigitalTwinCreate(
    val name: String,
    val icon: Int,
)