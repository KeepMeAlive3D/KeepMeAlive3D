package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.IModelService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ModelDownloadController(application: Application) : KoinComponent {
    private val modelService: IModelService by inject()

    init {
        application.routing {
            authenticate("jwt") {
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