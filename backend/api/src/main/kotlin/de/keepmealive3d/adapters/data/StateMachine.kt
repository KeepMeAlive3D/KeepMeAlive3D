package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable
import java.util.Locale.getDefault

@Serializable
data class StateMachine(
    val dtId: Int = 0,
    val pId: Int = 0,
    val id: Int = 0,
    val name: String,
    val initial: String?,
    val states: List<StateData>
)

@Serializable
data class StateChartInfo(
    val id: Int,
    val name: String
)

@Serializable
data class StateData(
    val id: String,
    val stateType: StateType,
    val isFinal: Boolean,
    val isFirst: Boolean,
    val posX: Int,
    val absX: Int,
    val width: Int,
    val posY: Int,
    val absY: Int,
    val height: Int,
    val isActive: Boolean,
    val details: StateInfoDetails,
    val childStates: List<StateData>,
    val connectedTo: List<String>
)

enum class StateType {
    PARALLEL,
    SEQUENTIAL,
    ATOMIC;

    override fun toString() = name.lowercase(getDefault())
}

@Serializable
data class StateDataOld(
    val id: String,
    val posX: Int,
    val posY: Int,
    val connectedTo: MutableList<String>,
    val details: StateInfoDetails
)

@Serializable
data class StateInfoDetails(
    val onEntry: Boolean = false,
    val onExit: Boolean = false,
    val transitions: List<StateTransitionDetails>,
)

@Serializable
data class StateTransitionDetails(
    val toState: String?,
    val event: String?,
    val condition: String?,
)