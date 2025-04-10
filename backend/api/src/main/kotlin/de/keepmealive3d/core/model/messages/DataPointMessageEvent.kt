package de.keepmealive3d.core.model.messages

import kotlinx.serialization.Serializable

@Serializable
data class DataPointMessageEvent(
    override val manifest: Manifest,
    override val message: DataPointMessageData,
): GenericMessageEvent

@Serializable
data class DataPointMessageData(
    override val topic: String,
    override val dataSource: String,
    val point: Double
): GenericMessageData
