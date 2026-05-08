package de.keepmealive3d.adapters.data

import de.keepmealive3d.adapters.serializer.UUIDSerializer
import de.keepmealive3d.adapters.serializer.UnixTimeSerializer
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import kotlinx.serialization.Serializable
import java.time.Instant
import java.util.UUID

@Serializable
data class EventLogInfoAll(
    val id: Int,
    val name: String,
    val owner: Int,
    val dt: Int,
    val refs: List<EventLogRefInfo>
)

@Serializable
data class EventLogInfo(
    val id: Int,
    val name: String,
    val owner: Int,
    val dt: Int
)

@Serializable
data class EventLogCreateInfo(
    val name: String
)


@Serializable
data class EventLogRefInfo(
    val id: Int,
    val owner: Int,
    val refId: Int,
    val dt: Int,
    val eventLog: EventLog,
    val type: EventLogTableType,
    val typeId: String
)

@Serializable
data class EventLog(
    val name: String,
    var traces: List<Trace>,
) {
    @Serializable
    data class Trace(
        val name: String?,
        val events: List<Event>,
        val replayState: ReplayState,
        var isHappyPath: Boolean = false,
    )

    enum class ReplayState {
        RUNNING,
        PAUSED,
        END,
    }

    @Serializable
    data class Event(
        val name: String?,
        @Serializable(UnixTimeSerializer::class)
        val datetime: Instant?,
        val source: String?,
        val value: String?,
        var replayState: EventReplayState = EventReplayState.NOT_EXECUTED,
        @Serializable(UUIDSerializer::class)
        var traceEventId: UUID = UUID.randomUUID()
    )

    enum class EventReplayState {
        EXECUTED,
        ACTIVE,
        NOT_EXECUTED
    }
}

@Serializable
data class SetHappyPathRequest(
    val traceId: String,
    val isHappyPath: Boolean,
)