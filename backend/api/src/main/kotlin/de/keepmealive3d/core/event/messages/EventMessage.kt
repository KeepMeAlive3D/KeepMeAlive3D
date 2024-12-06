package de.keepmealive3d.core.event.messages

import kotlinx.serialization.Serializable

@Serializable
data class EventMessage(
    val manifest: Manifest,
    val message: EventMessageData
)

@Serializable
data class EventMessageData(
    val topic: String,
    val dataSource: String,
    val eventData: String
)