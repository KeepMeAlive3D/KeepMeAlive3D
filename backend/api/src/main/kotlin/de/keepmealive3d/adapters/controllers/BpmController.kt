package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IBpmService
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.application.Application
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.response.respondFile
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import io.ktor.utils.io.readRemaining
import kotlinx.io.readByteArray
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class BpmController(application: Application): KoinComponent {
    private val bpmService: IBpmService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/dt/{dtId}/bpm") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")

                    call.respond(bpmService.getAll(dtId, owner.userId))
                }

                post("/api/dt/{dtId}/bpm") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")

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
                                bpmService.save(fileBytes, fileName, owner.userId, dtId)
                            }

                            else -> {}
                        }
                        part.dispose()
                    }

                    call.respond(HttpStatusCode.OK)
                }

                get("/api/dt/{dtId}/bpm/{bpmId}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val bpmId = call.parameters["bpmId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'bpmId' is required!")

                    call.respond(bpmService.get(dtId, bpmId, owner.userId))
                }

                get("/api/dt/{dtId}/bpm/{bpmId}/download") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val bpmId = call.parameters["bpmId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'bpmId' is required!")

                    call.respondFile(bpmService.download(dtId, owner.userId, bpmId))
                }

                delete("/api/dt/{id}/bpm/{bpmId}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val bpmId = call.parameters["bpmId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'bpmId' is required!")

                    bpmService.delete(owner.userId, bpmId)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}