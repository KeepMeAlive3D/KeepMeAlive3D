package de.keepmealive3d.adapters.model

import de.keepmealive3d.adapters.data.FileModelInfo
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.IModelService
import de.keepmealive3d.core.persistence.IModelRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ModelDownloadController(application: Application) : KoinComponent {
    private val modelRepository: IModelRepository by inject()
    private val modelService: IModelService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                post("api/model/download") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@post
                    }
                    val body = call.receive<FileModelInfo>()

                    val p = modelRepository.getModelLocation(user.userId, body.model, body.filename)
                    if (p == null) {
                        call.respond(HttpStatusCode.NotFound, "File not found!")
                        return@post
                    }
                    call.respondFile(p.toFile())
                }
                get("/api/model/{id}/download") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@get
                    }
                    val id = call.parameters["id"]?.toIntOrNull() ?: run {
                        call.respond(HttpStatusCode.BadRequest, "Missing or malformed model id!")
                        return@get
                    }

                    val path = modelService.getRequiredModelLocation(id, user.userId)
                    call.respondFile(path.toFile())
                }
            }
        }
    }
}