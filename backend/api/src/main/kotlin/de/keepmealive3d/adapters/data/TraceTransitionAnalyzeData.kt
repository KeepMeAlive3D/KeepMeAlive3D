package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class TraceTransitionAnalyzeData(
    val state: String,
    val previousState: String,
    val correlationEvent: String,
    val isErrorState: Boolean,
    val isTransitionError: Boolean,
    val errorDetectedCycle: Boolean,
    val executionDuration: Long,
    val latencyInfo: TraceTransitionLatencyInfo,
    val analysisFailed: Boolean,
    val executionTime: String,
    val correlationId: String,
    val cycleCount: Int,
)

enum class TraceTransitionLatencyInfo {
    NORMAL,
    SMALL_DEVIATION,
    LARGE_DEVIATION,
}