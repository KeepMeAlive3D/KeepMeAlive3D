package de.keepmealive3d.contract

import de.keepmealive3d.adapters.auth.AuthController
import de.keepmealive3d.adapters.auth.RegisterController
import de.keepmealive3d.appModule
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.jupiter.api.Timeout
import java.util.concurrent.TimeUnit

class UserContracts {
    @Test
    @Timeout(30, unit = TimeUnit.SECONDS)
    fun testRegister() = testApplication {
        application {
            appModule()
        }

        val client = createClient {
            this.install(ContentNegotiation) {
                json()
            }
        }

        client.get("/status")
        client.post("/api/register/basic") {
            header(HttpHeaders.ContentType, "application/json")
            setBody(RegisterController.RegisterData("Test User", "Test Password"))
        }.apply {
            assertEquals(HttpStatusCode.Created, status)
        }

        val response = client.post("/api/login/basic") {
            header(HttpHeaders.ContentType, "application/json")
            setBody(AuthController.BasicAuthRequest("Test User", "Test Password"))
        }.body<AuthController.AuthResponse>()

        client.delete("/api/user") {
            header(HttpHeaders.Authorization, "Bearer ${response.token}")
        }.apply {
            assertEquals(HttpStatusCode.Accepted, status)
        }

        client.close()
    }
}
