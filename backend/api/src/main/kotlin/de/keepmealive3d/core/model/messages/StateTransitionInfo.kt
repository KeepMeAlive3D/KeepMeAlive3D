package de.keepmealive3d.core.model.messages

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
): GenericMessageData