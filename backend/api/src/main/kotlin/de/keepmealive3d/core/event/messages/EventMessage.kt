package de.keepmealive3d.core.event.messages

import kotlinx.serialization.Serializable
import java.lang.reflect.Type
import java.time.Instant

fun wsCreateDataPointEventMessage(topic: String, dataSource: String, eventData: String, type: MessageType) =
    EventMessage(
        Manifest(1, type, Instant.now()),
        EventMessageData(topic, dataSource, eventData)
    )

fun wsCreateErrorEventMessage(errorType: String, description: String) = EventError(
    Manifest(1, MessageType.ERROR, Instant.now()),
    EventErrorData(errorType, description)
)

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

@Serializable
data class EventSubscribe(
    val manifest: Manifest,
    val message: EventMessageSubscribe
)

@Serializable
data class EventMessageSubscribe(
    val topic: String
)

@Serializable
data class EventError(
    val manifest: Manifest,
    val message: EventErrorData
)

@Serializable
data class EventErrorData(
    val type: String,
    val message: String
)