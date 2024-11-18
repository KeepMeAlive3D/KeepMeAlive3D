package de.keepmealive3d.event

import de.keepmealive3d.adapters.influx.KmaInfluxDatabase
import kotlinx.coroutines.channels.consumeEach
import kotlinx.coroutines.flow.consumeAsFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.koin.core.component.KoinComponent

class LiveDataEventHandler : EventHandler, KoinComponent {
    private val database = KmaInfluxDatabase()


    fun receive(topic: String, payload: String) {

        runBlocking {
            launch {
                try {
                    // TODO: write actual data
                    database.write("mem", "test", 42.0)

                    database.readAllMeasurements("mem").consumeAsFlow().collect { println("${it.value}") }

                } catch (exception: Exception) {
                    println(exception)
                }

            }
        }


        println("Received on topic: $topic -> $payload")
    }
}