package de.keepmealive3d.core.event.messages

import kotlinx.serialization.Serializable

@Serializable
data class PositionEventMessage(
    override val manifest: Manifest,
    override val message: PositionMessageData,
): GenericEventMessage

@Serializable
data class PositionMessageData(
    override val topic: String,
    override val dataSource: String,
    val position: Vector
): GenericMessageData

@Serializable
data class Vector(
    val x: Double,
    val y: Double,
    val z: Double,
)