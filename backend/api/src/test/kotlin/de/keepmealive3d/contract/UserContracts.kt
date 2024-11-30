package de.keepmealive3d.contract

import de.keepmealive3d.adapters.auth.RegisterController
import de.keepmealive3d.appModule
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Test

class UserContracts {
    @Test
    fun testRegister() = testApplication {
        application {
            appModule()
        }

        val client = createClient {
            this.install(ContentNegotiation) {
                json()
            }
        }

        runBlocking {
            delay(1000)
            println("send request!")

            client.get("/status")
            client.post("/api/register/basic") {
                header(HttpHeaders.ContentType, "application/json")
                setBody(RegisterController.RegisterData("Test User", "Test Password"))
            }.apply {
                assertEquals(HttpStatusCode.Created, status)
            }

            client.close()
        }
    }
}
