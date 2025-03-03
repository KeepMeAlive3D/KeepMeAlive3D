package de.keepmealive3d

import de.keepmealive3d.adapters.auth.AuthController
import de.keepmealive3d.adapters.auth.RegisterController
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import junit.framework.TestCase.assertEquals

suspend fun ApplicationTestBuilder.setupTestUser(): String {
    val client = createClient {
        this.install(ContentNegotiation) {
            json()
        }
    }

    client.post("/api/register/basic") {
        header(HttpHeaders.ContentType, "application/json")
        setBody(RegisterController.RegisterData("Test User", "Test Password"))
    }
    val response = client.post("/api/login/basic") {
        header(HttpHeaders.ContentType, "application/json")
        setBody(AuthController.BasicAuthRequest("Test User", "Test Password"))
    }.body<AuthController.AuthResponse>()
    return response.token
}

suspend fun ApplicationTestBuilder.cleanupTestUser(token: String) {
    val client = createClient {
        this.install(ContentNegotiation) {
            json()
        }
    }

    client.delete("/api/user") {
        header(HttpHeaders.Authorization, "Bearer $token")
    }.also {
        assertEquals(HttpStatusCode.OK, it.status)
    }
    client.close()
}
