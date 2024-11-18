package de.keepmealive3d.event

import com.influxdb.client.domain.WritePrecision
import com.influxdb.client.kotlin.InfluxDBClientKotlinFactory
import com.influxdb.client.write.Point
import de.keepmealive3d.config.Config
import kotlinx.coroutines.runBlocking
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.Instant

class LiveDataEventHandler() : EventHandler, KoinComponent {
    private val config: Config by inject()

    private val client = InfluxDBClientKotlinFactory.create(
        "http://${config.databases.influx.host}:${config.databases.influx.port}",
        config.databases.influx.token.toCharArray(),
        config.databases.influx.org,
        config.databases.influx.bucket
    )


    fun receive(topic: String, payload: String) {

        runBlocking {
            client.use {
                val writeApi = client.getWriteKotlinApi()

                val point = Point
                    .measurement("mem")
                    .addTag("message", payload)
                    .addField("used_percent", 23.43234543)
                    .time(Instant.now(), WritePrecision.NS)

                try {
                    writeApi.writePoint(point)
                } catch (e: Exception) {
                    println(e)
                }

            }
        }


        println("Received on topic: $topic -> $payload")
    }
}