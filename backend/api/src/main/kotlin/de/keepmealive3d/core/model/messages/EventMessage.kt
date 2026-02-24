package de.keepmealive3d.core.model.messages

import kotlinx.serialization.Serializable
import java.time.Instant

fun wsCreateDataPointEventMessage(topic: String, dataSource: String, point: Double) = DataPointMessageEvent(
    Manifest(1, MessageType.TOPIC_DATAPOINT, Instant.now()),
    DataPointMessageData(topic, dataSource, point)
)

fun wsCreateRelativePositionMessageEvent(
    topic: String,
    dataSource: String,
    percentage: Double
) = RelativePositionMessageEvent(
    Manifest(1, MessageType.ANIMATION_RELATIVE, Instant.now()),
    RelativePositionMessageData(topic, dataSource, percentage)
)

fun wsCreateErrorEventMessage(errorType: String, description: String) = ErrorEvent(
    Manifest(1, MessageType.ERROR, Instant.now()),
    EventErrorData(errorType, description)
)

@Serializable
sealed interface GenericMessageEvent {
    val manifest: Manifest
    val message: GenericMessageData
}

@Serializable
sealed interface GenericMessageData {
    val topic: String
    val dataSource: String
}

@Serializable
data class SubscribeEvent(
    val manifest: Manifest,
    val message: MessageSubscribeEventData
)

@Serializable
data class EndOfMessageEvent(
    val manifest: Manifest
)

@Serializable
data class UnknownTypeEvent(
    val manifest: Manifest
)

@Serializable
data class MessageSubscribeEventData(
    val topic: String
)

@Serializable
data class ReplayStartEvent(
    val manifest: Manifest,
    val dtId: Int,
    val logId: Int,
    val trace: String
)

@Serializable
data class ReplayPauseEvent(
    val manifest: Manifest,
    val dtId: Int,
    val logId: Int,
    val trace: String
)

@Serializable
data class ReplayEndEvent(
    val manifest: Manifest,
    val dtId: Int,
    val logId: Int,
    val trace: String
)

@Serializable
data class ReplayForwardEvent(
    val manifest: Manifest,
    val dtId: Int,
    val logId: Int,
    val trace: String,
    val offset: Long
)

@Serializable
data class ErrorEvent(
    override val manifest: Manifest,
    override val message: EventErrorData
) : GenericMessageEvent

@Serializable
data class EventErrorData(
    val type: String,
    val message: String,
    override val topic: String = "",
    override val dataSource: String = ""
) : GenericMessageData