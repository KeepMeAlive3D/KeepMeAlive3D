package de.keepmealive3d.plugins

import io.github.smiley4.ktorswaggerui.SwaggerUI
import io.github.smiley4.ktorswaggerui.routing.openApiSpec
import io.github.smiley4.ktorswaggerui.routing.swaggerUI
import io.ktor.resources.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.resources.*
import io.ktor.server.resources.Resources
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.io.File

fun Application.configureRouting() {
    install(SwaggerUI) {
        swagger {

        }
        info {
            title = "Example API"
            version = "latest"
            description = "Example API for testing and demonstration purposes."
        }
        server {
            url = "http://127.0.0.1:8080"
            description = "Development Server"
        }
    }
    install(Resources)
    routing {
        get("/status") {
            call.respondText("Up!")
        }
        staticFiles("/", File("dist"), "index.html")
        staticResources("/static", "static")
        route("api.json") {
            openApiSpec()
        }
        route("swagger") {
            swaggerUI("/api.json")
        }
    }
}
