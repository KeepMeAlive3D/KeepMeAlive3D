package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestData
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.model.IModelService
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
    private val modelService: IModelService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                var fileDescription = ""
                var fileName = ""

                post("/api/model/upload/{filepath}") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val filePath = call.parameters["filepath"] ?: UUID.randomUUID().toString()
                    var modelId : Int? = null

                    val multipartData = call.receiveMultipart(Long.MAX_VALUE)

                    multipartData.forEachPart { part ->
                        when (part) {
                            is PartData.FormItem -> {
                                fileDescription = part.value
                            }

                            is PartData.FileItem -> {
                                fileName = part.originalFileName as String
                                val fileBytes = part.provider().readRemaining().readByteArray()
                                modelId = modelService.createNewModel(user.userId, filePath, fileName, fileBytes)
                            }

                            else -> {}
                        }
                        part.dispose()
                    }

                    modelId?.let {
                        call.respond(HttpStatusCode.Created, it)
                        return@post
                    }
                    throw BadRequestData("No file provided!")
                }
            }
        }
    }
}