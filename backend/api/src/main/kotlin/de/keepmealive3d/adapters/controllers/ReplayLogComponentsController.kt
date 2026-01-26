package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.data.CreateReplayLogComponent
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IReplayComponentService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ReplayLogComponentsController(application: Application) : KoinComponent {
    private val service by inject<IReplayComponentService>()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/dt/{dtId}/log/{logId}/trace/{trace}/replayComponent") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val logId = call.parameters["logId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")
                    val trace = call.parameters["trace"]
                        ?: throw BadRequestDataException("Request parameter 'trace' is required!")

                    call.respond(service.getAllComponents(owner.userId, dtId, logId, trace))
                }

                post("/api/dt/{dtId}/log/{logId}/trace/{trace}/replayComponent") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val logId = call.parameters["logId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")
                    val trace = call.parameters["trace"]
                        ?: throw BadRequestDataException("Request parameter 'trace' is required!")

                    val body = call.receive<CreateReplayLogComponent>()

                    service.addComponent(
                        owner.userId,
                        dtId,
                        body.participantId,
                        logId,
                        trace,
                        body.type,
                        body.additionalIdentifier
                    )
                    call.respond(HttpStatusCode.OK)
                }

                delete("/api/dt/{dtId}/log/{logId}/trace/{trace}/replayComponent/{componentId}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val componentId = call.parameters["componentId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")

                    service.removeComponent(componentId, owner.userId)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}