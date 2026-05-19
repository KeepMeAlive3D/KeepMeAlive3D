package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.data.ProcessParticipantCreate
import de.keepmealive3d.adapters.data.ProcessParticipantInfo
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IProcessParticipantService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ProcessParticipantController(application: Application) : KoinComponent {
    private val processParticipantService: IProcessParticipantService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                post("/api/dt/{dt}/participant") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val participantCreateInfo = call.receive<ProcessParticipantCreate>()
                    val dt = call.parameters["dt"]?.toIntOrNull() ?: return@post call.respond(HttpStatusCode.BadRequest)
                    call.respond(processParticipantService.create(participantCreateInfo, dt, caller.userId))
                }
                get("/api/dt/{dt}/participant/{id}") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val dt = call.parameters["dt"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    call.respond(processParticipantService.get(id, dt, caller.userId))
                }
                get("/api/dt/{dt}/participant/") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dt = call.parameters["dt"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    call.respond(processParticipantService.getAll(dt, caller.userId))
                }
                put("/api/dt/{dt}/participant") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dt = call.parameters["dt"]?.toIntOrNull() ?: return@put call.respond(HttpStatusCode.BadRequest)
                    val participantCreateInfo = call.receive<ProcessParticipantInfo>()
                    call.respond(processParticipantService.update(participantCreateInfo, dt, caller.userId))
                }
                delete("/api/dt/{dt}/participant/{id}") {
                    val caller = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    val dt = call.parameters["dt"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    processParticipantService.delete(id, dt, caller.userId)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}