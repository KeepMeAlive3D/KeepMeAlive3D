package de.keepmealive3d.plugins

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    install(Resources)
    routing {
        get("/status") {
            call.respondText("Up!")
        }
        swaggerUI("/swagger", "openapi/documentation.yaml") {}
        singlePageApplication {
            useResources = true
            react("static")
        }
    }
}
