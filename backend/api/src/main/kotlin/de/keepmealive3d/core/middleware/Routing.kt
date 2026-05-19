package de.keepmealive3d.core.middleware

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.FileNotFoundException
import java.io.InputStream

fun Application.configureRouting() {


    install(Resources)
    routing {
        get("/status") {
            call.respondText("Up!")
        }
        get("/api/version") {
            call.respondText(ResourceLoader.getResourceAsStream("kma_version").readAllBytes().decodeToString())
        }
        swaggerUI("/swagger", "openapi/documentation.yaml") {}
        singlePageApplication {
            useResources = true
            react("static")
        }
    }
}

object ResourceLoader {
    fun getResourceAsStream(filePath: String): InputStream {
        return this::class.java.classLoader.getResourceAsStream(filePath)
            ?: throw FileNotFoundException("could not find $filePath")
    }
}