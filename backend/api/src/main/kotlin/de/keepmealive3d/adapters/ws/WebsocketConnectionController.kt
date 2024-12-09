package de.keepmealive3d.adapters.ws

import de.keepmealive3d.core.event.messages.EventError
import de.keepmealive3d.core.event.messages.EventErrorData
import de.keepmealive3d.core.event.messages.EventMessage
import de.keepmealive3d.core.event.messages.EventMessageData
import de.keepmealive3d.core.event.messages.EventSubscribe
import de.keepmealive3d.core.event.messages.Manifest
import de.keepmealive3d.core.event.messages.MessageType
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
import okhttp3.internal.wait
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier

class WebsocketConnectionController(application: Application): KoinComponent {
    private val eventChanel: Channel<EventMessage> by inject(qualifier("events"))

    init {
        application.routing {
            webSocket("/ws") {
                val rcv = async(Dispatchers.IO) {
                    for(frame in incoming) {
                        if(frame is Frame.Text) {
                            val text = frame.readText()
                            try {
                                val sub = Json.decodeFromString<EventSubscribe>(text)
                            } catch (e: Exception) {
                                outgoing.send(Frame.Text(Json.encodeToString(EventError(
                                    Manifest(1, MessageType.ERROR),
                                    EventErrorData("BadRequest", "Unable to read message!")
                                ))))
                            }
                            application.log.info("WS receive: $text")
                        }
                    }
                }

                val send = launch {
                    for (event in eventChanel) {
                        //todo filter + check
                        outgoing.send(Frame.Text(Json.encodeToString(event)))
                    }
                }

                rcv.await()
                send.cancel()
            }
        }
    }
}