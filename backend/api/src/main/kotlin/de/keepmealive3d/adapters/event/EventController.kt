package de.keepmealive3d.adapters.event

import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.core.auth.KmaUserPrincipal
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
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Forbidden, "userid could not be found!")
                        return@get
                    }
                    val source = call.parameters["source"] ?: run {
                        call.respond(HttpStatusCode.BadRequest, "source could not be found!")
                        return@get
                    }
                    val topic = call.parameters["topic"] ?: run {
                        call.respond(HttpStatusCode.BadRequest, "topic could not be found!")
                        return@get
                    }
                    val limit = call.parameters["limit"]?.toIntOrNull() ?: run {
                        call.respond(HttpStatusCode.BadRequest, "limit could not be found!")
                        return@get
                    }
                    call.respond(eventDao.loadEvents(source, topic, limit))
                }
            }
        }
    }
}