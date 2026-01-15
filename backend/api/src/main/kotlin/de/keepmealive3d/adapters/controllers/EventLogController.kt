package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IEventLogService
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.routing.*
import io.ktor.utils.io.readRemaining
import kotlinx.io.readByteArray
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class EventLogController(application: Application) : KoinComponent {
    private val eventLogService by inject<IEventLogService>()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/dt/{dtId}/log/{logId}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val logId = call.parameters["logId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")

                    call.respond(eventLogService.get(owner.userId, dtId, logId))
                }
                get("/api/dt/{dtId}/log") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")

                    call.respond(eventLogService.getAll(owner.userId, dtId))
                }
                post("/api/dt/{dtId}/log") {
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
                                eventLogService.save(owner.userId, dtId, fileBytes, fileName)
                            }

                            else -> {}
                        }
                        part.dispose()
                    }

                    call.respond(HttpStatusCode.OK)
                }
                delete("/api/dt/{dtId}/log/{logId}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val logId = call.parameters["logId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")

                    eventLogService.delete(owner.userId, dtId, logId)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}