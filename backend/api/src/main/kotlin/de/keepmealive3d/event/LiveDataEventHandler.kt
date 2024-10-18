package de.keepmealive3d.event

class LiveDataEventHandler: EventHandler {
    fun receive(topic: String, payload: String) {
        println("Received on topic: $topic -> $payload")
    }
}