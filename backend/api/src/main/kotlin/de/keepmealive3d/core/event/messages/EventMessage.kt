package de.keepmealive3d.core.event.messages

import kotlinx.serialization.Serializable
import java.time.Instant

fun wsCreateDataPointEventMessage(topic: String, dataSource: String, point: Double) = DataPointEventMessage(
    Manifest(1, MessageType.TOPIC_DATAPOINT, Instant.now()),
    DataPointMessageData(topic, dataSource, point)
)

fun wsCreateRelativePositionMessageEvent(
    topic: String,
    dataSource: String,
    percentage: Double
) = RelativePositionEventMessage(
    Manifest(1, MessageType.ANIMATION_RELATIVE, Instant.now()),
    RelativePositionMessageData(topic, dataSource, percentage)
)

fun wsCreateErrorEventMessage(errorType: String, description: String) = EventError(
    Manifest(1, MessageType.ERROR, Instant.now()),
    EventErrorData(errorType, description)
)

@Serializable
sealed interface GenericEventMessage {
    val manifest: Manifest
    val message: GenericMessageData
}

@Serializable
sealed interface GenericMessageData {
    val topic: String
    val dataSource: String
}

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
    override val manifest: Manifest,
    override val message: EventErrorData
) : GenericEventMessage

@Serializable
data class EventErrorData(
    val type: String,
    val message: String,
    override val topic: String = "",
    override val dataSource: String = ""
) : GenericMessageData