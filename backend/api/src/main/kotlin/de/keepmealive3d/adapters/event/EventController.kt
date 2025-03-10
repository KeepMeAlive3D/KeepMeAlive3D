package de.keepmealive3d.adapters.event

import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.BadRequestData
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class EventController(application: Application) : KoinComponent {
    private val eventDao: EventDao by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/event/{source}/dataPoints/{topic}/limit/{limit}") {
                    call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val source = call.parameters["source"]
                        ?: throw BadRequestData("Request parameter 'source' is required!")
                    val topic = call.parameters["topic"]
                        ?: throw BadRequestData("Request parameter 'topic' is required!")
                    val limit = call.parameters["limit"]?.toIntOrNull()
                        ?: throw BadRequestData("Request parameter 'limit' is required and has to be an integer!")
                    call.respond(eventDao.loadEvents(source, topic, limit))
                }
            }
        }
    }
}