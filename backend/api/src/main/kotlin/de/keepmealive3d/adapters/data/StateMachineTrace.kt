package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class StateMachineTrace(
    val id: Int,
    val refId: Int,
    val trace: String,
    val stateMachineId: Int,
    val stateId: String,
    val execDuration: Long
)