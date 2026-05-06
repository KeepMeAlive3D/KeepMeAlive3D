package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.replay.IReplayService
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import kotlin.getValue
import io.ktor.server.auth.*
import io.ktor.server.response.respond
import io.ktor.server.routing.put

class ReplayController(application: Application) : KoinComponent {
    private val replayService: IReplayService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                put("/api/dt/{dtId}/log/{logId}/replay") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val logId = call.parameters["logId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")

                    replayService.startAllReplays(dtId, logId, owner.userId)
                    call.respond(HttpStatusCode.OK)
                }
                put("/api/dt/{dtId}/log/{logId}/trace/{trace}/replay") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val logId = call.parameters["logId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'logId' is required!")
                    val trace = call.parameters["trace"]
                        ?: throw BadRequestDataException("Request parameter 'trace' is required!")

                    replayService.startReplay(dtId, logId, trace, owner.userId)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}