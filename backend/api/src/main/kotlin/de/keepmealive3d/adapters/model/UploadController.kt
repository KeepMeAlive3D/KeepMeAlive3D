package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.ModelRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.util.*

class UploadController(application: Application) : KoinComponent {
    val modelRepository: ModelRepository by inject()

    init {
        application.routing {
            authenticate("jwt") {
                post("/api/upload") {
                    val user = call.principal<KmaUserPrincipal>()
                    val filename = call.parameters["filename"] ?: UUID.randomUUID().toString()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@post
                    }

                    val path = modelRepository.saveFile(user.userId, filename)
                    call.receiveChannel().copyAndClose(path.toFile().writeChannel())
                    call.response.headers.append(
                        HttpHeaders.Location,
                        "/api/model/$filename"
                    )
                    call.respond(HttpStatusCode.Created, "File created!")
                }
            }
        }
    }
}