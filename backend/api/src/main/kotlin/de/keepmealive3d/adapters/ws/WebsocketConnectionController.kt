package de.keepmealive3d.adapters.ws

import de.keepmealive3d.core.event.messages.EventSubscribe
import de.keepmealive3d.core.event.messages.GenericEventMessage
import de.keepmealive3d.core.event.messages.wsCreateErrorEventMessage
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier

class WebsocketConnectionController(application: Application): KoinComponent {
    private val eventChannel: Channel<GenericEventMessage> by inject(qualifier("events"))

    init {
        application.routing {
            webSocket("/ws") {
                val subscriptions = hashSetOf<String>()

                val rcv = async(Dispatchers.IO) {
                    for(frame in incoming) {
                        if(frame is Frame.Text) {
                            val text = frame.readText()
                            try {
                                val sub = Json.decodeFromString<EventSubscribe>(text)
                                subscriptions.add(sub.message.topic)
                            } catch (_: Exception) {
                                val msg = wsCreateErrorEventMessage("BadRequest", "Unable to read message")
                                outgoing.send(Frame.Text(Json.encodeToString(msg)))
                            }
                        }
                    }
                }

                val send = launch {
                    for (event in eventChannel) {
                        if(subscriptions.contains(event.message.topic)) {
                            outgoing.send(Frame.Text(Json.encodeToString(event)))
                        }
                    }
                }

                rcv.await()
                send.cancel()
            }
        }
    }
}