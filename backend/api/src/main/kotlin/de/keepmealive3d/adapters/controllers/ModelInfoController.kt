package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.data.AvailableFiles
import de.keepmealive3d.adapters.data.ModelSettings
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IModelService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
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
                    call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'id' is required and has to be an integer!")

                    //we don't check if the model is owned by the userid
                    val settings = modelService.getSettings(id)
                        ?: throw EntityNotFoundException("Model with id '$id' not found!")

                    call.respond(settings)
                }

                put("/api/model/{id}/setting") {
                    call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'id' is required and has to be an integer!")
                    val body = call.receive<ModelSettings>()
                    modelService.updateSettings(id, body)
                    call.respond(HttpStatusCode.OK)
                }

                get("/api/models") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")

                    call.respond(AvailableFiles(modelService.getAllModels(user.userId).toSet()))
                }
            }
        }
    }
}