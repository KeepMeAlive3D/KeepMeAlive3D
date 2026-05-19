package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.data.DigitalTwinCreate
import de.keepmealive3d.adapters.data.StateMachine
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IStateMachineService
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.*
import kotlinx.io.readByteArray
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

class StateMachineController(application: Application) : KoinComponent {
    private val stateMachineService: IStateMachineService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                post("/api/dt/{dtId}/participant/{pId}/statemachine") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@post call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@post call.respond(HttpStatusCode.BadRequest)

                    var fileDescription = ""
                    var fileName = ""
                    val multipartData = call.receiveMultipart(Long.MAX_VALUE)

                    multipartData.forEachPart { part ->
                        when (part) {
                            is PartData.FormItem -> {
                                fileDescription = part.value
                            }

                            is PartData.FileItem -> {
                                fileName = part.originalFileName as String
                                val fileBytes = part.provider().readRemaining().readByteArray()
                                stateMachineService.createStateMachine(user.userId, dtId, pId, fileBytes, fileName)
                            }

                            else -> {}
                        }
                        part.dispose()
                    }

                    call.respond(HttpStatusCode.OK)
                }

                put("/api/dt/{dtId}/participant/{pId}/statemachine/{id}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val pId = call.parameters["pId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'pId' is required!")
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'id' is required!")
                    val smInfo = call.receive<StateMachine>()

                    stateMachineService.updateStateMachine(owner.userId, dtId, pId, id, smInfo)
                    call.respond(HttpStatusCode.OK)
                }

                get("/api/dt/{dtId}/participant/{pId}/statemachine/{id}") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val id =
                        call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)

                    call.respond(stateMachineService.getStateMachine(user.userId, dtId, pId, id))
                }

                get("/api/dt/{dtId}/participant/{pId}/statemachine") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val files = stateMachineService.getStateMachines(user.userId, dtId, pId)
                    call.respond(files)
                }

                delete("/api/dt/{dtId}/participant/{pId}/statemachine/{id}") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    val id =
                        call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)

                    stateMachineService.deleteStateMachine(user.userId, dtId, pId, id)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}