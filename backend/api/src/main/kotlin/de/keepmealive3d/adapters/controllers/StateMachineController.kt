package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.core.auth.KmaUserPrincipal
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

                get("/api/dt/{dtId}/participant/{pId}/statemachine/{fileName}") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val fileName =
                        call.parameters["fileName"]?.let {
                            URLDecoder.decode(it, StandardCharsets.UTF_8)
                        } ?: return@get call.respond(
                            HttpStatusCode.BadRequest
                        )

                    call.respond(stateMachineService.getDecodedStateMachine(user.userId, dtId, pId, fileName))
                }

                get("/api/dt/{dtId}/participant/{pId}/statemachine") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
                    val files = stateMachineService.getStateMachines(user.userId, dtId, pId)
                    call.respond(files.map { file -> URLEncoder.encode(file, StandardCharsets.UTF_8) })
                }

                delete("/api/dt/{dtId}/participant/{pId}/statemachine/{fileName}") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    val dtId =
                        call.parameters["dtId"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    val pId =
                        call.parameters["pId"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest)
                    val fileName =
                        call.parameters["fileName"]?.let {
                            URLDecoder.decode(it, StandardCharsets.UTF_8)
                        } ?: return@delete call.respond(
                            HttpStatusCode.BadRequest
                        )

                    stateMachineService.deleteStateMachine(user.userId, dtId, pId, fileName)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}