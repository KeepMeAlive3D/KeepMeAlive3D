package de.keepmealive3d.core.event

import de.keepmealive3d.adapters.influx.KmaInfluxDatabase
import kotlinx.coroutines.flow.consumeAsFlow
import kotlinx.coroutines.*
import org.koin.core.component.KoinComponent

class LiveDataEventHandler : EventHandler, KoinComponent {
    private val database = KmaInfluxDatabase()


    suspend fun receive(topic: String, payload: String) = withContext(Dispatchers.IO) {
        try {
            // TODO: write actual data
            database.write("mem", "test", 42.0)
            database.readAllMeasurements("mem").consumeAsFlow().collect { println("${it.value}") }
        } catch (exception: Exception) {
            println(exception)
        }
        println("Received on topic: $topic -> $payload")
    }

    fun receiveEvent(topic: String, event: Event) {

    }
}