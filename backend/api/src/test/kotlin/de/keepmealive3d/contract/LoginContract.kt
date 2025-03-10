package de.keepmealive3d.contract

import de.keepmealive3d.adapters.auth.AuthController
import de.keepmealive3d.adapters.auth.RegisterController
import de.keepmealive3d.adapters.data.RestErrorInfo
import de.keepmealive3d.appModule
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import org.junit.Assert.assertEquals
import org.junit.jupiter.api.assertDoesNotThrow
import kotlin.test.Test

class LoginContract {

    @Test
    fun testLogin() = testApplication {
        application {
            appModule()
        }

        val client = createClient {
            this.install(ContentNegotiation) {
                json()
            }
        }

        val username = "foo"
        val password = "bar"

        client.post("/api/login/basic") {
            header(HttpHeaders.ContentType, "application/json")
            setBody(AuthController.BasicAuthRequest(username, password))
        }.apply {
            assertEquals(HttpStatusCode.Forbidden, status)
            assertDoesNotThrow { body<RestErrorInfo>() }
        }

        client.post("/api/register/basic") {
            header(HttpHeaders.ContentType, "application/json")
            setBody(RegisterController.RegisterData(username, password))
        }.apply {
            assertEquals(HttpStatusCode.Created, status)
        }

        val response = client.post("/api/login/basic") {
            header(HttpHeaders.ContentType, "application/json")
            setBody(AuthController.BasicAuthRequest(username, password))
        }.apply {
            assertEquals(HttpStatusCode.OK, status)
        }.body<AuthController.AuthResponse>()

        client.post("/api/login/basic") {
            header(HttpHeaders.ContentType, "application/json")
            setBody(AuthController.BasicAuthRequest(username, "wrongPassword"))
        }.apply {
            assertEquals(HttpStatusCode.Forbidden, status)
            assertDoesNotThrow { body<RestErrorInfo>() }
        }

        client.delete("/api/user") {
            header(HttpHeaders.Authorization, "Bearer ${response.token}")
        }.apply {
            assertEquals(HttpStatusCode.Accepted, status)
        }
    }
}