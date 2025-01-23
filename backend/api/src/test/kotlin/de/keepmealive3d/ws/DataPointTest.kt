package de.keepmealive3d.ws

import de.keepmealive3d.SetupMqttTestClient
import de.keepmealive3d.appModule
import de.keepmealive3d.cleanupTestUser
import de.keepmealive3d.core.event.messages.DataPointEventMessage
import de.keepmealive3d.core.event.messages.GenericEventMessage
import de.keepmealive3d.setupTestUser
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import org.eclipse.paho.client.mqttv3.MqttClient
import org.eclipse.paho.client.mqttv3.MqttMessage
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class DataPointTest {
    private var token: String? = null
    private var mqttClient: MqttClient? = null

    @BeforeTest
    fun setUp() = testApplication {
        application {
            appModule()
        }

        token = setupTestUser()
    }

    @Test(timeout = 15_000)
    fun publishDataPointHappyPathRestProvidesData() = testApplication {
        application {
            appModule()

            mqttClient = SetupMqttTestClient().getClient()
            assert(mqttClient != null)
            assert(mqttClient!!.isConnected)
            mqttClient!!.publish("data.point.test.foo", MqttMessage("0.3".toByteArray(Charsets.UTF_8)))
            mqttClient!!.disconnect()
            Thread.sleep(1_000)
        }

        val client = createClient {
            this.install(ContentNegotiation) {
                json()
            }
        }

        val req = client.get("/api/event/MQTT/dataPoints/data.point.test.foo/limit/10") {
            headers {
                append(HttpHeaders.Authorization, "Bearer $token")
                append(HttpHeaders.ContentType, "application/json")
            }
        }.apply {
            assertEquals(HttpStatusCode.OK, status)
        }

        val events = req.body<List<GenericEventMessage>>()
        assert(events.all { it.message.topic == "data.point.test.foo" })
        assert(events.all { it.message.dataSource == "MQTT" })
        events.map { it as DataPointEventMessage }.first { it.message.point == 0.3 }
    }

    @AfterTest
    fun cleanUp() = testApplication {
        application {
            appModule()
        }

        cleanupTestUser(token!!)
    }
}