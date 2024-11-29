package de.keepmealive3d.adapters.auth

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.encryption.EncryptionService
import de.keepmealive3d.core.user.LoginType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import kotlinx.serialization.Serializable
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class RegisterController(application: Application): KoinComponent {
    val kmaDatabase: KmaSqlDatabase by inject()
    val encryptionService: EncryptionService by inject()

    init {
        application.routing {
            post("/api/register/basic") {
                val body = call.receive<RegisterData>()
                val pw = encryptionService.hash(body.password)
                if(pw == null) {
                    call.respond(HttpStatusCode.BadRequest, "register.pw.invalid")
                    return@post
                }
                kmaDatabase.insertUser(body.username, pw, LoginType.BASIC)
                call.respond(HttpStatusCode.OK)
            }
        }
    }

    @Serializable
    data class RegisterData(
        val username: String,
        val password: String
    )
}