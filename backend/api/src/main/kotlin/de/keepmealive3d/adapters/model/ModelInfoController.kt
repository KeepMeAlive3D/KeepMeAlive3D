package de.keepmealive3d.adapters.model

import de.keepmealive3d.adapters.data.AvailableFiles
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.model.IModelService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ModelInfoController(application: Application) : KoinComponent {
    private val modelService: IModelService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/model/{id}/setting") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@get
                    }
                    val id = call.parameters["id"]?.toIntOrNull() ?: run {
                        call.respond(HttpStatusCode.BadRequest, "Missing or malformed id!")
                        return@get
                    }

                    //we don't check if the model is owned by the userid
                    val settings = modelService.getSettings(id) ?: run {
                        call.respond(HttpStatusCode.NotFound, "The model does not exist!")
                        return@get
                    }

                    call.respond(settings)
                }

                get("/api/models") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@get
                    }

                    call.respond(AvailableFiles(modelService.getAllModels(user.userId).toSet()))
                }
            }
        }
    }
}