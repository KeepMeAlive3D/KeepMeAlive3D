package de.keepmealive3d.publisher

import de.keepmealive3d.config.Config
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import org.eclipse.paho.client.mqttv3.MqttAsyncClient
import org.eclipse.paho.client.mqttv3.MqttClient
import org.eclipse.paho.client.mqttv3.MqttConnectOptions
import org.eclipse.paho.client.mqttv3.MqttMessage
import java.io.File

fun main() {
    val config = Config.load(File("config.yml")).getOrElse {
        println("Could not load config.yml")
        return
    }

    val client = MqttClient(
        "tcp://${config.databases.mqtt.host}:${config.databases.mqtt.port}",
        MqttAsyncClient.generateClientId(),
    )
    val topic = config.databases.mqtt.topic
    val connectionOptions = MqttConnectOptions()

    connectionOptions.userName = config.databases.mqtt.clientId
    connectionOptions.password = config.databases.mqtt.password.toCharArray()
    connectionOptions.isCleanSession = true

    client.connect(connectionOptions)

    val range = (0..100)

    runBlocking {
        while (true) {
            val randomNumber = range.random()
            client.publish(topic, MqttMessage("{\"value\": $randomNumber}".toByteArray()))
            delay(1000)
        }
    }
}