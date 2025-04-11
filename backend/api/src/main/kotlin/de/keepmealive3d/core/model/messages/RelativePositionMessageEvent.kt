package de.keepmealive3d.core.model.messages

import kotlinx.serialization.Serializable

@Serializable
data class RelativePositionMessageEvent(
    override val manifest: Manifest,
    override val message: RelativePositionMessageData,
): GenericMessageEvent

@Serializable
data class RelativePositionMessageData(
    override val topic: String,
    override val dataSource: String,
    val percentage: Double
): GenericMessageData