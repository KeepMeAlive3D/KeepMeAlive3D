package de.keepmealive3d.core.event.messages

import kotlinx.serialization.Serializable

@Serializable
data class RelativePositionEventMessage(
    override val manifest: Manifest,
    override val message: RelativePositionMessageData,
): GenericEventMessage

@Serializable
data class RelativePositionMessageData(
    override val topic: String,
    override val dataSource: String,
    val percentage: Double
): GenericMessageData