package de.keepmealive3d.core.model.dt

data class ProcessParticipantDocument(
    val id: Int,
    val owner: Int,
    val dt: Int,
    val name: String,
    val icon: Int,
)

data class ProcessParticipantCreateDocument(
    val owner: Int,
    val dt: Int,
    val name: String,
    val icon: Int,
)