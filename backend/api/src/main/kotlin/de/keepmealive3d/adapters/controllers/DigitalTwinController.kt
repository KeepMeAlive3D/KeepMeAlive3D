package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.data.DigitalTwinCreate
import de.keepmealive3d.adapters.data.DigitalTwinInfo
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IDigitalTwinService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class DigitalTwinController(application: Application): KoinComponent {
    val digitalTwinService: IDigitalTwinService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                post("/api/dt") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtCreateInfo = call.receive<DigitalTwinCreate>()
                    call.respond(digitalTwinService.create(caller.userId, dtCreateInfo))
                }
                put("/api/dt") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtCreateInfo = call.receive<DigitalTwinInfo>()
                    call.respond(digitalTwinService.update(caller.userId, dtCreateInfo))
                }
                delete("/api/dt/{id}") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    digitalTwinService.delete(caller.userId, id)
                    call.respond(HttpStatusCode.OK)
                }
                get("/api/dt/{id}") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    call.respond(digitalTwinService.getInfo(caller.userId, id))
                }
                get("/api/dt") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    call.respond(digitalTwinService.getAll(caller.userId))
                }
            }
        }
    }
}