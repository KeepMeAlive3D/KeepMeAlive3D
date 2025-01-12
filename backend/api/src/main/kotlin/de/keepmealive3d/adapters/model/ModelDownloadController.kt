package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.ModelRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ModelDownloadController(application: Application): KoinComponent {
    private val modelRepository: ModelRepository by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/models") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@get
                    }

                    call.respond(AvailableFiles(files = modelRepository.getAllModelFileNames(user.userId)))
                }
                post("api/model/download") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@post
                    }
                    val body = call.receive<ModelInfo>()

                    val p = modelRepository.getModelLocation(user.userId, body.model, body.filename)
                    if(p == null) {
                        call.respond(HttpStatusCode.NotFound, "File not found!")
                        return@post
                    }
                    call.respondFile(p.toFile())
                }
            }
        }
    }

    @Serializable
    data class AvailableFiles(
        val files: Set<ModelInfo>
    )

    @Serializable
    data class ModelInfo(
        val filename: String,
        val model: String
    )
}