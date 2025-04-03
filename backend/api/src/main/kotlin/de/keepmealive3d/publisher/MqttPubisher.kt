package de.keepmealive3d.publisher

import de.keepmealive3d.config.Config
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.eclipse.paho.client.mqttv3.MqttAsyncClient
import org.eclipse.paho.client.mqttv3.MqttClient
import org.eclipse.paho.client.mqttv3.MqttConnectOptions
import org.eclipse.paho.client.mqttv3.MqttMessage
import java.io.File
import kotlin.random.Random

fun main() {
    val config = Config.load(File("config.yml")).getOrElse {
        println("Could not load config.yml")
        return
    }

    val client = MqttClient(
        "tcp://${config.databases.mqtt.host}:${config.databases.mqtt.port}",
        MqttAsyncClient.generateClientId(),
    )

    val moveTopic = "move.querausleger"
    val rotationTopic = "rot.drehkranz_oben001"
    val psuTemp = "info.psu.temp"
    val connectionOptions = MqttConnectOptions()

    connectionOptions.userName = config.databases.mqtt.clientId
    connectionOptions.password = config.databases.mqtt.password.toCharArray()
    connectionOptions.isCleanSession = true

    client.connect(connectionOptions)



    runBlocking {
        launch {
            while (true) {
                for (i in 1..100) {
                    client.publish(
                        psuTemp,
                        MqttMessage(
                            "${Random.nextLong(0, 100)}".toByteArray(),
                        )
                    )
                    client.publish(
                        moveTopic,
                        MqttMessage(
                            "$i".toByteArray(),
                        )
                    )
                    delay(Random.nextLong(100, 1000))
                }
            }
        }


        launch {
            while (true) {
                for (i in 1..360) {
                    client.publish(
                        rotationTopic,
                        MqttMessage(
                            "$i".toByteArray(),
                        )
                    )
                    delay(Random.nextLong(100, 2000))
                }
            }
        }
    }
}