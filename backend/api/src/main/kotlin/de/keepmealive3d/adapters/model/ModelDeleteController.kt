package de.keepmealive3d.adapters.model

import de.keepmealive3d.adapters.model.ModelDownloadController.ModelInfo
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.ModelRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ModelDeleteController(application: Application) : KoinComponent {
    private val modelRepository: ModelRepository by inject()

    init {
        application.routing {
            authenticate("jwt") {
                post("/api/model/delete") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@post
                    }
                    val body = call.receive<ModelInfo>()

                    val deleted = modelRepository.deleteFile(user.userId, body.model, body.filename)
                    if (deleted) {
                        call.respond(HttpStatusCode.OK, "File deleted successfully!")
                    } else {
                        call.respond(HttpStatusCode.InternalServerError, "File could not be deleted!")
                    }
                }
            }
        }
    }
}