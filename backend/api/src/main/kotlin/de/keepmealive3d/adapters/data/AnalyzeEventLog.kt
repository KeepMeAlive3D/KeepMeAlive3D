package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class EventLogAnalyzed(
    val participantId: String,
    val data: List<EventLogAnalyzedParticipant>
)

@Serializable
data class EventLogAnalyzedParticipant(
    val trace: EventLog.Trace,
    val data: List<TraceTransitionAnalyzeData>
)

fun mapToEventLogAnalyzedDto(data: Map<String, Map<EventLog.Trace, List<TraceTransitionAnalyzeData>>>): List<EventLogAnalyzed> {
    return data.map { (participant, eventLogAnalyzed) ->
        EventLogAnalyzed(
            participant,
            eventLogAnalyzed.map { (trace, transition) ->
                EventLogAnalyzedParticipant(
                    trace,
                    transition
                )
            }
        )
    }
}