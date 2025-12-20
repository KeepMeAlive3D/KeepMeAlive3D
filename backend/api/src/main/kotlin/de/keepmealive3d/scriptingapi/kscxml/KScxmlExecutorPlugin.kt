package de.keepmealive3d.scriptingapi.kscxml

import de.keepmealive3d.config.Config
import de.keepmealive3d.scriptingapi.Plugin
import dev.klenz.matthias.kscxml.KScxml
import dev.klenz.matthias.kscxml.components.KScxmlRootNode
import dev.klenz.matthias.kscxml.execution.KScxmlExecutor
import dev.klenz.matthias.kscxml.execution.state.InternalScxmlState
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import java.io.File
import java.util.concurrent.ConcurrentHashMap

class KScxmlExecutorPlugin : Plugin() {
    data class ExecutorData(
        val rootNode: KScxmlRootNode,
        val executor: KScxmlExecutor,
        val state: InternalScxmlState,
    )

    private var client: MqttClient? = null
        set(value) {
            if (value == null) {
                throw IllegalArgumentException("MqttClient cannot be null!")
            }
            field = value
        }
    private val connectionOptions = MqttConnectOptions()
    val stateCharts: ConcurrentHashMap<String, ExecutorData> = ConcurrentHashMap()

    override suspend fun registerStateChart(file: File) {
        KScxml.load(file.readText()).rootNode?.let {
            val state = InternalScxmlState()
            stateCharts[file.name] = ExecutorData(
                it,
                KScxmlExecutor(it, state),
                state
            )
        }
    }

    override suspend fun activateStateChart(chart: String) {
        stateCharts[chart]?.executor?.start()
    }

    override suspend fun getActiveStateChartStates(chart: String): List<String> {
        stateCharts[chart]?.let {
            return it.state.activeStates.mapNotNull { state -> state.id }
        }
        return emptyList()
    }

    override suspend fun registerStateChangeListener(callback: suspend (chart: String, from: String, to: String) -> Unit) {
        client!!.setCallback(object : MqttCallback {
            override fun connectionLost(cause: Throwable?) {
                println("Connection lost: ${cause?.message}")
            }

            override fun messageArrived(topic: String?, message: MqttMessage?) {
                runBlocking {
                    launch {
                        //val data = message?.payload?.let { String(it) } ?: ""
                        if (topic == null)
                            return@launch
                        if (topic.startsWith("scxml.")) {
                            val parts = topic.split(".")
                            val id = parts[1]
                            val scxmlEvent = parts.drop(2).joinToString(".")

                            stateCharts[id]?.executor?.onEvent(scxmlEvent)

                            return@launch
                        }
                    }
                }
            }

            override fun deliveryComplete(token: IMqttDeliveryToken?) {
                return
            }
        })
        client!!.connect(connectionOptions)
        client!!.subscribe("*")
        while (true) {
            delay(1000)
        }
    }

    override suspend fun onEnable(config: Config) {
        val memoryPersistence = MemoryPersistence()
        client = MqttClient(
            "tcp://${config.databases.mqtt.host}:${config.databases.mqtt.port}",
            MqttAsyncClient.generateClientId(),
            memoryPersistence
        )

        connectionOptions.userName = config.databases.mqtt.clientId
        connectionOptions.password = config.databases.mqtt.password.toCharArray()
        connectionOptions.isCleanSession = true

    }


}