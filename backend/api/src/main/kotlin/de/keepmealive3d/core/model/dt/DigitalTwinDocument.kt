package de.keepmealive3d.core.model.dt

data class DigitalTwinDocument(
    val id: Int,
    val owner: Int,
    val name: String,
    val icon: Int,
)

data class DigitalTwinCreateDocument(
    val owner: Int,
    val name: String,
    val icon: Int,
)