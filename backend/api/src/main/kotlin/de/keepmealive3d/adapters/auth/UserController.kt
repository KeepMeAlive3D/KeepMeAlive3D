package de.keepmealive3d.adapters.auth

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.user.LoginType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.log
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.response.respond
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

    val database: KmaSqlDatabase by inject()

    init {
        application.routing {
            authenticate("jwt") {
                get("/api/user") {
                    val user = call.principal<KmaUserPrincipal>()
                    if(user == null) {
                        call.respond(HttpStatusCode.Forbidden)
                        return@get
                    }
                    val dbUser = database.getUser(user.userId)
                    if(dbUser == null) {
                        application.log.error("User not found but token valid: ${user.userName} and ${user.userId}")
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }
                    call.respond(UserInfo(user.userName, dbUser.loginType))
                }
            }
        }
    }
}