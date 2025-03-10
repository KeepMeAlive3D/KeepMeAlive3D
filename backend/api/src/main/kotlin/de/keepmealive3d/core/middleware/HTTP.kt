package de.keepmealive3d.core.middleware

import de.keepmealive3d.config.Config
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.cors.routing.*

fun Application.configureHTTP(config: Config) {
    install(Compression)
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Get)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)

        if(config.allowedCORS.isNotEmpty()) {
            config.allowedCORS.forEach {
                allowHost(it, listOf("https"))
            }
        } else {
            anyHost()
        }
    }
}
