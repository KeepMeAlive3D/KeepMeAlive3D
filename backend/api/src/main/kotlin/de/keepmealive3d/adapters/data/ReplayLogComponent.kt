package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class ReplayLogComponent(
    val id: Int,
    val dt: Int,
    val owner: Int,
    val logId: Int,
    val trace: String,
    val participantId: Int,
    val type: String,
    val additionalIdentifier: String
)

@Serializable
data class CreateReplayLogComponent(
    val logId: Int,
    val trace: String,
    val participantId: Int,
    val type: String,
    val additionalIdentifier: String
)