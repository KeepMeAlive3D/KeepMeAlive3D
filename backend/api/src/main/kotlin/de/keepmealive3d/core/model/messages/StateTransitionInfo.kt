package de.keepmealive3d.core.model.messages

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import kotlinx.serialization.Serializable

@Serializable
data class StateTransitionInfo(
    override val manifest: Manifest,
    override val message: StateTransitionInfoData,
): GenericMessageEvent

@Serializable
data class StateTransitionInfoData(
    val from: String,
    val to: String,
    override val topic: String,
    override val dataSource: String,
    val activeStates: List<String>?,
    val allEvents: List<EventLog.Event>,
    val type: EventLogTableType,
    val typeId: String,
    val dt: Int
): GenericMessageData