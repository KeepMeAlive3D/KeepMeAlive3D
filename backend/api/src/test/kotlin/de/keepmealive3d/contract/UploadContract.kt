package de.keepmealive3d.contract

import de.keepmealive3d.adapters.data.AvailableFiles
import de.keepmealive3d.adapters.data.FileModelInfo
import de.keepmealive3d.adapters.data.ModelInfo
import de.keepmealive3d.adapters.model.ModelDownloadController
import de.keepmealive3d.appModule
import de.keepmealive3d.cleanupTestUser
import de.keepmealive3d.setupTestUser
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import java.io.File
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class UploadContract {
    private var token: String? = null

    @BeforeTest
    fun setUp() = testApplication {
        application {
            appModule()
        }
        token = setupTestUser()
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

        val file = File(Thread.currentThread().contextClassLoader?.getResource("testfile")?.path ?: run {
            throw Exception("No upload file was found in the resources, where looking for 'testfile'!")
        })

        //upload
        client.submitFormWithBinaryData(
            url = "/api/model/upload/testmodel",
            formData = formData {
                append("file", file.readBytes(), Headers.build {
                    append(HttpHeaders.ContentDisposition, "filename=${file.name}")
                })
            },
            block = {
                method = HttpMethod.Post
                header(HttpHeaders.Authorization, "Bearer $token")
            }
        ).apply {
            assertEquals(HttpStatusCode.Created, status)
        }

        //list files
        val files = client.get("/api/models") {
            header(HttpHeaders.ContentType, "application/json")
            header(HttpHeaders.Authorization, "Bearer $token")
        }.body<AvailableFiles>()

        val testFile = files.files.find { it.filename == "testfile" && it.model == "testmodel" }
        assert(testFile != null)
        testFile!!

        //download
        val text = client.get("api/model/${testFile.modelId}/download") {
            headers {
                append(HttpHeaders.Authorization, "Bearer $token")
                append(HttpHeaders.ContentType, "application/json")
            }
        }.bodyAsText()

        assertEquals(file.readText(), text)

        //delete file
        client.delete("/api/model/${testFile.modelId}") {
            headers {
                append(HttpHeaders.Authorization, "Bearer $token")
                append(HttpHeaders.ContentType, "application/json")
            }
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Expected status OK for route: '/api/model/${testFile.modelId}'")
        }
    }

    @AfterTest
    fun cleanUp() = testApplication {
        application {
            appModule()
        }
        cleanupTestUser(token!!)
    }
}