package de.keepmealive3d.contract

import de.keepmealive3d.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureRouting()
        }
        client.get("/status").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertEquals("Up!", bodyAsText())
        }
    }
}
