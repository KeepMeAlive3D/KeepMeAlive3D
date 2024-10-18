package de.keepmealive3d.scriptingapi

import kotlinx.serialization.Serializable

@Serializable
data class PluginConfig(
    val name: String,
    val main: String,
    val version: String
)