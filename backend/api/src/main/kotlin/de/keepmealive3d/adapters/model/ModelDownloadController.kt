package de.keepmealive3d.adapters.model

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestData
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
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
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: throw BadRequestData("Request parameter 'id' is required and has to be an integer!")

                    val path = modelService.getRequiredModelLocation(id, user.userId)
                    call.respondFile(path.toFile())
                }
            }
        }
    }
}