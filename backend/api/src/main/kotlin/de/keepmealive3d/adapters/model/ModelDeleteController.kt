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

class ModelDeleteController(application: Application) : KoinComponent {
    private val modelService: IModelService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                delete("/api/model/{id}") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@delete
                    }
                    val id = call.parameters["id"]?.toIntOrNull() ?: run {
                        call.respond(HttpStatusCode.BadRequest, "Missing or malformed id!")
                        return@delete
                    }
                    modelService.deleteModel(id, user.userId)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}