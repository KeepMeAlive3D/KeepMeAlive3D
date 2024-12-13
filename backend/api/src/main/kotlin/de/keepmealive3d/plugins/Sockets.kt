package de.keepmealive3d.plugins

import io.ktor.server.application.*
import io.ktor.server.websocket.*
import kotlin.time.Duration

fun Application.configureSockets() {
    install(WebSockets) {
        pingPeriod = Duration.parse("15s")
        timeout = Duration.parse("15s")
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
}
