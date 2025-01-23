package de.keepmealive3d.core.event.messages

import kotlinx.serialization.Serializable

@Serializable
data class DataPointEventMessage(
    override val manifest: Manifest,
    override val message: DataPointMessageData,
): GenericEventMessage

@Serializable
data class DataPointMessageData(
    override val topic: String,
    override val dataSource: String,
    val point: Double
): GenericMessageData
