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
    val topic = "machine.test.rotor.speed"
    val moveTopic = "machine.move.9V_querausleger_sauger_id2046_step"
    val connectionOptions = MqttConnectOptions()

    connectionOptions.userName = config.databases.mqtt.clientId
    connectionOptions.password = config.databases.mqtt.password.toCharArray()
    connectionOptions.isCleanSession = true

    client.connect(connectionOptions)

    val range = (1..10)

    runBlocking {
        while (true) {
            for(i in 1..100) {
                val z = -0.19853481650352478 + (i/1000.0)
                client.publish(
                    moveTopic,
                    MqttMessage(
                        "-0.22887501120567322,0.48093798756599426,${z}".toByteArray(),
                    )
                )
                delay(1000 )
            }
        }
    }
}