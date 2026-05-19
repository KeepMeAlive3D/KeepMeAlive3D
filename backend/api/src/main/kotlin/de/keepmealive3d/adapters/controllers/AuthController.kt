package de.keepmealive3d.adapters.controllers

import de.keepmealive3d.adapters.serializer.UnixTimeSerializer
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.auth.JWT
import de.keepmealive3d.core.auth.KmaUserPrincipal
import de.keepmealive3d.core.encryption.EncryptionService
import de.keepmealive3d.core.exceptions.InvalidAuthTokenException
import de.keepmealive3d.core.exceptions.InvalidCredentialsException
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

    @Serializable
    data class BasicAuthRequest(
        val username: String,
        val password: String
    )

    private val jwt: JWT by inject()
    private val database: KmaSqlDatabase by inject()
    private val encryptionService: EncryptionService by inject()

    init {
        application.routing {
            authenticate("oauth") {
                post("/api/login/oauth") {
                    //automatic redirect to oAuth provider by Oauth Plugin
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val token = jwt.generateToken(user.userId, user.userName)
                    val tokenExpire = jwt.expireDate(token)
                    val refresh = jwt.generateRefreshToken(user.userId, user.userName)
                    call.respond(HttpStatusCode.OK, AuthResponse(token, refresh, tokenExpire.getOrNull()))
                }
            }
            post("/api/login/basic") {
                val body = call.receive<BasicAuthRequest>()
                val dbUser = database.getUser(body.username)
                    ?: throw InvalidCredentialsException("Wrong username or password!")
                if (!encryptionService.verifyHash(body.password, dbUser.password)) {
                    throw InvalidCredentialsException("Wrong username or password!")
                }
                val token = jwt.generateToken(dbUser.userid, dbUser.name)
                val tokenExpire = jwt.expireDate(token)
                val refresh = jwt.generateRefreshToken(dbUser.userid, dbUser.name)
                call.respond(HttpStatusCode.OK, AuthResponse(token, refresh, tokenExpire.getOrNull()))
            }
            authenticate("jwt") {
                post("/api/login/refresh") {
                    val user = call.principal<KmaUserPrincipal>()
                        ?: throw InvalidAuthTokenException("Could not authenticate")
                    val token = jwt.generateToken(user.userId, user.userName)
                    val tokenExpire = jwt.expireDate(token)
                    val refresh = jwt.generateRefreshToken(user.userId, user.userName)
                    call.respond(HttpStatusCode.OK, AuthResponse(token, refresh, tokenExpire.getOrNull()))
                }
            }
        }
    }
}

