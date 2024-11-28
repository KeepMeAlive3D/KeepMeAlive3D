package de.keepmealive3d.core.event

class LiveDataEventHandler: EventHandler {
    fun receive(topic: String, payload: String) {
        println("Received on topic: $topic -> $payload")
    }

    fun receiveEvent(topic: String, event: Event) {

    }
}