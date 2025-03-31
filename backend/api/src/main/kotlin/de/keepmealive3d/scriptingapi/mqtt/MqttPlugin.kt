package de.keepmealive3d.scriptingapi.mqtt

import de.keepmealive3d.config.Config
import de.keepmealive3d.core.event.messages.*
import de.keepmealive3d.scriptingapi.Plugin
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence

class MqttPlugin : Plugin() {
    private var client: MqttClient? = null
        set(value) {
            if (value == null) {
                throw IllegalArgumentException("MqttClient cannot be null!")
            }
            field = value
        }
    private var topic: String = ""
    private val connectionOptions = MqttConnectOptions()

    override suspend fun onEnable(config: Config) {
        val memoryPersistence = MemoryPersistence()
        client = MqttClient(
            "tcp://${config.databases.mqtt.host}:${config.databases.mqtt.port}",
            MqttAsyncClient.generateClientId(),
            memoryPersistence
        )
        topic = config.databases.mqtt.topic

        connectionOptions.userName = config.databases.mqtt.clientId
        connectionOptions.password = config.databases.mqtt.password.toCharArray()
        connectionOptions.isCleanSession = true

    }

    override suspend fun registerLiveDataAdapter(
        rcv: suspend (msg: GenericEventMessage) -> Unit,
        interruptCallback: () -> Boolean
    ) {
        //sanity check
        if (client == null)
            throw IllegalStateException("MQTT client is not initialized!")

        client!!.setCallback(object : MqttCallback {
            override fun connectionLost(cause: Throwable?) {
                println("Connection lost: ${cause?.message}")
            }

            override fun messageArrived(topic: String?, message: MqttMessage?) {
                runBlocking {
                    launch {
                        val data = message?.payload?.let { String(it) } ?: ""
                        if (topic == null)
                            return@launch
                        if (topic.startsWith("move.") || topic.startsWith("rot.")) {
                            rcv(
                                wsCreateRelativePositionMessageEvent(
                                    topic,
                                    "MQTT",
                                    data.toDoubleOrNull() ?: 0.0
                                )
                            )
                            return@launch
                        }
                        rcv(
                            wsCreateDataPointEventMessage(topic, "MQTT", data.toDoubleOrNull() ?: 0.0)
                        )
                    }
                }
            }

            override fun deliveryComplete(token: IMqttDeliveryToken?) {
                return
            }
        })
        client!!.connect(connectionOptions)
        client!!.subscribe(topic)
        while (interruptCallback()) {
            delay(1000)
        }
    }
}