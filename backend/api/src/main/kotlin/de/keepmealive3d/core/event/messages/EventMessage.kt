package de.keepmealive3d.core.event.messages

import de.keepmealive3d.adapters.serializer.UnixTimeSerializer
import kotlinx.serialization.Serializable
import java.time.Instant

fun wsCreateDataPointEventMessage(topic: String, dataSource: String, point: Double) = DataPointEventMessage(
    Manifest(1, MessageType.TOPIC_DATAPOINT, Instant.now()),
    DataPointMessageData(topic, dataSource, point)
)

fun wsCreatePositionMessageEvent(
    topic: String,
    dataSource: String,
    position: Triple<Double, Double, Double>
) = PositionEventMessage(
    Manifest(1, MessageType.ANIMATION_POSITION, Instant.now()),
    PositionMessageData(topic, dataSource, Vector(position.first, position.second, position.third))
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
data class ReplayStart(
    val manifest: Manifest,
    @Serializable(with = UnixTimeSerializer::class)
    val start: Instant,
    @Serializable(with = UnixTimeSerializer::class)
    val stop: Instant
)

@Serializable
data class ReplayStop(
    val manifest: Manifest,
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