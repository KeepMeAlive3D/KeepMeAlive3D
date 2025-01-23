package de.keepmealive3d

import de.keepmealive3d.config.Config
import org.eclipse.paho.client.mqttv3.MqttAsyncClient
import org.eclipse.paho.client.mqttv3.MqttClient
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class SetupMqttTestClient : KoinComponent {
    private val config by inject<Config>()

    fun getClient() = MqttClient(
        "tcp://${config.databases.mqtt.host}:${config.databases.mqtt.port}",
        MqttAsyncClient.generateClientId(),
    ).also {
        it.connect()
    }
}