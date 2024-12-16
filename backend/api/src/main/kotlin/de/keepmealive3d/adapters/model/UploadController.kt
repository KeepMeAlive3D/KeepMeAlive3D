package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.ModelRepository
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
import java.util.*

class UploadController(application: Application) : KoinComponent {
    private val modelRepository: ModelRepository by inject()

    init {
        application.routing {
            authenticate("jwt") {
                var fileDescription = ""
                var fileName = ""

                post("/api/model/{filepath}") {
                    println("================================= HERE =================================")
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@post
                    }
                    val filePath = call.parameters["filepath"] ?: UUID.randomUUID().toString()

                    val multipartData = call.receiveMultipart()

                    multipartData.forEachPart { part ->
                        when (part) {
                            is PartData.FormItem -> {
                                fileDescription = part.value
                            }

                            is PartData.FileItem -> {
                                fileName = part.originalFileName as String
                                val fileBytes = part.provider().readRemaining().readByteArray()
                                val path = modelRepository.createUniqueFileLocation(user.userId, filePath, fileName)
                                path.toFile().writeBytes(fileBytes)
                            }

                            else -> {}
                        }
                        part.dispose()
                    }

                    call.respond(HttpStatusCode.Created, "File created!")
                }
            }
        }
    }
}