package de.keepmealive3d.event

import com.influxdb.client.domain.WritePrecision
import com.influxdb.client.kotlin.InfluxDBClientKotlinFactory
import com.influxdb.client.write.Point
import de.keepmealive3d.config.Config
import kotlinx.coroutines.runBlocking
import java.time.Instant

class LiveDataEventHandler(conf: Config) : EventHandler {
    private val client = InfluxDBClientKotlinFactory.create(
        "http://${conf.databases.influx.host}:${conf.databases.influx.port}",
        conf.databases.influx.token.toCharArray(),
        conf.databases.influx.org,
        conf.databases.influx.bucket
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