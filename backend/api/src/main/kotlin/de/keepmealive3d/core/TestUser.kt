package de.keepmealive3d.core

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import io.ktor.server.application.Application
import io.ktor.server.auth.authenticate
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class TestUser(application: Application): KoinComponent {
    val database: KmaSqlDatabase by inject()

    init {
        with(application) {
            routing {
                authenticate("oauth", "basic", optional = false) {
                    get("user/{id}") {
                        call.respondText("Hello ${database.getUser(call.parameters["id"]!!.toInt())}")
                    }
                }
            }
        }
    }
}