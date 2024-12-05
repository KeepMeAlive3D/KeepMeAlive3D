package de.keepmealive3d.adapters.influx

import com.influxdb.client.domain.WritePrecision
import com.influxdb.client.kotlin.InfluxDBClientKotlin
import com.influxdb.client.kotlin.InfluxDBClientKotlinFactory
import com.influxdb.client.write.Point
import com.influxdb.query.FluxRecord
import de.keepmealive3d.config.Config
import kotlinx.coroutines.channels.Channel
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.Instant

class KmaInfluxDatabase : KoinComponent {
    private val config: Config by inject()
    private val client: InfluxDBClientKotlin = InfluxDBClientKotlinFactory.create(
        "http://${config.databases.influx.host}:${config.databases.influx.port}",
        config.databases.influx.token.toCharArray(),
        config.databases.influx.org,
        config.databases.influx.bucket
    )


    suspend fun write(measurementName: String, fieldName: String, value: Double) {
        val point = Point
            .measurement(measurementName)
            .addField(fieldName, value)
            .time(Instant.now(), WritePrecision.NS)

        write(point)
    }

    suspend fun write(point: Point) {
        val writeApi = client.getWriteKotlinApi()
        writeApi.writePoint(point)
    }

    fun readAllMeasurements(measurementName: String): Channel<FluxRecord> {
        val queryApi = client.getQueryKotlinApi()
        val fluxQuery =
            "from(bucket: \"${config.databases.influx.bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == \"$measurementName\")"
        return queryApi.query(fluxQuery)
    }
}