package de.keepmealive3d.scriptingapi.mqtt

import de.keepmealive3d.config.Config
import de.keepmealive3d.scriptingapi.Plugin
import kotlinx.coroutines.delay
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
        rcv: (topic: String, value: String) -> Unit,
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
                rcv(topic ?: "<unknown>", message?.payload?.let { String(it) } ?: "empty")
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