package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class ProcessParticipantInfo(
    val id: Int,
    val name: String,
    val icon: Int
)

@Serializable
data class ProcessParticipantCreate(
    val name: String,
    val icon: Int
)
