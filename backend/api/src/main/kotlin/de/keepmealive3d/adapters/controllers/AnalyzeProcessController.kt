package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.data.mapToEventLogAnalyzedDto
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.services.IProcessAnalyzerService
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.respond
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class AnalyzeProcessController(application: Application) : KoinComponent {
    private val processAnalyzerService: IProcessAnalyzerService by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/dt/{dtId}/log/{refId}/analyze/{stateMachine}/trace/{trace}") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val refId = call.parameters["refId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'refId' is required!")
                    val stateMachine = call.parameters["stateMachine"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'stateMachine' is required!")
                    val trace = call.parameters["trace"]
                        ?: throw BadRequestDataException("Request parameter 'trace' is required!")

                    call.respond(processAnalyzerService.processTrace(owner.userId, dtId, refId, stateMachine, trace))
                }

                get("/api/dt/{dtId}/log/{refId}/analyze") {
                    val owner = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dtId = call.parameters["dtId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'dtId' is required!")
                    val refId = call.parameters["refId"]?.toIntOrNull()
                        ?: throw BadRequestDataException("Request parameter 'refId' is required!")

                    call.respond(
                        mapToEventLogAnalyzedDto(
                            processAnalyzerService.processEventLog(owner.userId, dtId, refId)
                        )
                    )
                }
            }
        }
    }
}