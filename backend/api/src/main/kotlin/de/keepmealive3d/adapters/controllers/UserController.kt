package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.user.LoginType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.log
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.response.respond
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import kotlinx.serialization.Serializable
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class UserController(application: Application): KoinComponent {
    @Serializable
    class UserInfo(
        val username: String,
        val loginType: LoginType,
    )

    private val database: KmaSqlDatabase by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/user") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val dbUser = database.getUser(user.userId) ?: run {
                        application.log.error("User not found but token valid: ${user.userName} and ${user.userId}")
                        throw EntityNotFoundException("User not found in database!")
                    }
                    call.respond(UserInfo(user.userName, dbUser.loginType))
                }

                delete("/api/user") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    if(database.deleteUser(user.userId) == 1) {
                        call.respond(HttpStatusCode.Accepted)
                    } else {
                        call.respond(HttpStatusCode.Conflict)
                    }
                }
            }
        }
    }
}