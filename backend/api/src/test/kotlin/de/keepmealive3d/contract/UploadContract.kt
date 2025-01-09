package de.keepmealive3d.contract

import de.keepmealive3d.adapters.auth.AuthController
import de.keepmealive3d.adapters.auth.RegisterController
import de.keepmealive3d.adapters.model.ModelDownloadController
import de.keepmealive3d.appModule
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import io.ktor.util.cio.readChannel
import kotlin.io.path.Path
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class UploadContract {
    var token: String? = null

    @BeforeTest
    fun setUp() = testApplication {
        application {
            appModule()
        }

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
        token = response.token
    }

    @Test
    fun testUpload() = testApplication {
        application {
            appModule()
        }

        val client = createClient {
            this.install(ContentNegotiation) {
                json()
            }
        }

        val file = Path(Thread.currentThread().contextClassLoader?.getResource("testfile")?.path ?: run {
            throw Exception("No upload file was found in the resources, where looking for 'testfile'!")
        }).toFile()

        //upload
        client.post("/api/model/testmodel") {
            header(HttpHeaders.Authorization, "Bearer $token")
            setBody(file.readChannel())
        }.apply {
            assertEquals(HttpStatusCode.Created, status)
        }

        //list files
        val files = client.get("/api/models") {
            header(HttpHeaders.ContentType, "application/json")
            header(HttpHeaders.Authorization, "Bearer $token")
        }.body<ModelDownloadController.AvailableFiles>()

        assert(files.files.contains(ModelDownloadController.ModelInfo("testfile", "testmodel")))

        //download
        val text = client.get("api/model/testfile") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }.bodyAsText()

        assertEquals(file.readText(), text)

        //delete file
        client.delete("/api/model/testfile") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }.apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }

    @AfterTest
    fun cleanUp() = testApplication {
        application {
            appModule()
        }

        val client = createClient {
            this.install(ContentNegotiation) {
                json()
            }
        }

        client.delete("/api/user") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }
        client.close()
    }
}