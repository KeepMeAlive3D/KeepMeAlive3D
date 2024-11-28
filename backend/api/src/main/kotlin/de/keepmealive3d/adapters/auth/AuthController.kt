package de.keepmealive3d.adapters.auth

import de.keepmealive3d.adapters.serializer.UnixTimeSerializer
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.auth.JWT
import de.keepmealive3d.core.auth.KmaUserPrincipal
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.receive
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.Instant

class AuthController(application: Application) : KoinComponent {
    @Serializable
    data class AuthResponse(
        val token: String,
        val refreshToken: String,
        @Serializable(with = UnixTimeSerializer::class)
        val expiresIn: Instant? = null,
    )

    val jwt: JWT by inject()
    val database: KmaSqlDatabase by inject()

    init {
        application.routing {
            authenticate("oauth") {
                post("/api/login/oauth") {
                    //automatic redirect to oAuth provider by Oauth Plugin
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.BadRequest, "Could not Authenticate!")
                        return@post
                    }
                    val token = jwt.generateToken(user.userId, user.userName)
                    val tokenExpire = jwt.expireDate(token)
                    val refresh = jwt.generateRefreshToken(user.userId, user.userName)
                    call.respond(HttpStatusCode.OK, AuthResponse(token, refresh, tokenExpire.getOrNull()))
                }
            }
            post("/api/login/basic") {
                val body = call.receive<BasicAuthRequest>()
                val dbUser = database.getUser(body.username)
                if(dbUser == null) {
                    call.respond(HttpStatusCode.BadRequest, "Could not Authenticate!")
                    return@post
                }
                val token = jwt.generateToken(dbUser.userid, dbUser.name)
                val tokenExpire = jwt.expireDate(token)
                val refresh = jwt.generateRefreshToken(dbUser.userid, dbUser.name)
                call.respond(HttpStatusCode.OK, AuthResponse(token, refresh, tokenExpire.getOrNull()))
            }
            authenticate("jwt") {
                post("/api/login/refresh") {
                    val user = call.principal<KmaUserPrincipal>()
                    if (user == null) {
                        call.respond(HttpStatusCode.BadRequest, "Could not Authenticate!")
                        return@post
                    }
                    val token = jwt.generateToken(user.userId, user.userName)
                    val tokenExpire = jwt.expireDate(token)
                    val refresh = jwt.generateRefreshToken(user.userId, user.userName)
                    call.respond(HttpStatusCode.OK, AuthResponse(token, refresh, tokenExpire.getOrNull()))
                }
            }
        }
    }
}

@Serializable
data class BasicAuthRequest(
    val username: String,
    val password: String
)