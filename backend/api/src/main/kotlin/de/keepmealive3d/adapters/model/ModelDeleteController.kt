package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.ModelRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ModelDeleteController(application: Application): KoinComponent {
    private val modelRepository: ModelRepository by inject()

    init {
        application.routing {
            authenticate("jwt") {
                delete("/api/model/{filename}") {
                    val user = call.principal<KmaUserPrincipal>()
                    val filename = call.parameters["filename"]
                    if(filename == null) {
                        call.respond(HttpStatusCode.BadRequest, "No file specified!")
                        return@delete
                    }
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@delete
                    }

                    val deleted = modelRepository.deleteFile(user.userId, filename)
                    if(deleted) {
                        call.respond(HttpStatusCode.OK, "File deleted successfully!")
                    } else {
                        call.respond(HttpStatusCode.InternalServerError, "File could not be deleted!")
                    }
                }
            }
        }
    }
}