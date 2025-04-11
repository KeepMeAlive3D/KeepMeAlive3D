package de.keepmealive3d.core.model.messages

import de.keepmealive3d.adapters.serializer.UnixTimeSerializer
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class Manifest(
    val version: Int = 1,
    val messageType: MessageType,
    @Serializable(with = UnixTimeSerializer::class)
    val timestamp: Instant? = Instant.now(),
    val bearerToken: String? = null,
    val uuid: String? = "",
)