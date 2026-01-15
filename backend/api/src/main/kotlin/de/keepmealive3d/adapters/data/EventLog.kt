package de.keepmealive3d.adapters.data

import de.keepmealive3d.adapters.serializer.UnixTimeSerializer
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class EventLogInfo(
    val id: Int,
    val owner: Int,
    val dt: Int,
    val eventLog: EventLog,
)

@Serializable
data class EventLog(
    val name: String,
    val traces: List<Trace>,
) {
    @Serializable
    data class Trace(
        val name: String?,
        val events: List<Event>
    )

    @Serializable
    data class Event(
        val name: String?,
        @Serializable(UnixTimeSerializer::class)
        val datetime: Instant?,
        val source: String?,
        val value: String?
    )
}

