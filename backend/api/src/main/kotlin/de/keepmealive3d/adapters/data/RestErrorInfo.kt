package de.keepmealive3d.adapters.data

import kotlinx.serialization.Serializable

@Serializable
data class RestErrorInfo(
    val name: String,
    val message: String,
    val code: Int
)