package de.keepmealive3d.core.auth

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.session
import io.ktor.server.response.respond
import io.ktor.server.response.respondRedirect
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import io.ktor.server.sessions.maxAge
import kotlinx.serialization.Serializable
import org.koin.core.component.KoinComponent
import kotlin.time.Duration

@Serializable
data class UserSession(val name: String, val userid: Int)

class SessionAuth(application: Application) : KoinComponent {
    init {
        application.install(Sessions) {
            cookie<UserSession>("user_session") {
                cookie.path = "/"
                cookie.maxAge = Duration.INFINITE
            }
        }
        application.install(Authentication) {
            session<UserSession>("auth-session") {
                validate { session ->
                    session
                }
                challenge {
                    call.respond(HttpStatusCode.Unauthorized)
                }
            }
        }
    }
}