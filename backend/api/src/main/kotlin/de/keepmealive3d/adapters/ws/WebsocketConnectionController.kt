package de.keepmealive3d.adapters.ws

import de.keepmealive3d.core.model.messages.SubscribeEvent
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import de.keepmealive3d.core.model.messages.MessageType
import de.keepmealive3d.core.model.messages.ReplayEndEvent
import de.keepmealive3d.core.model.messages.ReplayStartEvent
import de.keepmealive3d.core.model.messages.ReplayStopEvent
import de.keepmealive3d.core.model.messages.UnknownTypeEvent
import de.keepmealive3d.core.model.messages.wsCreateErrorEventMessage
import de.keepmealive3d.core.services.IWsSessionService
import de.keepmealive3d.core.services.WsSessionService
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import jdk.internal.net.http.common.Log.channel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.SendChannel
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier
import java.util.UUID

class WebsocketConnectionController(application: Application) : KoinComponent {
    private val sessionService: IWsSessionService by inject()
    private val jsonParser = Json {
        ignoreUnknownKeys = true
    }

    init {
        application.routing {
            webSocket("/ws") {
                var session: String? = null
                for (frame in incoming) {
                    if (frame is Frame.Text) {
                        val text = frame.readText()
                        try {
                            val msg = jsonParser.decodeFromString<UnknownTypeEvent>(text)
                            session = msg.manifest.uuid
                            when (msg.manifest.messageType) {
                                MessageType.SUBSCRIBE_TOPIC -> {
                                    sessionService.topicSubscribe(jsonParser.decodeFromString<SubscribeEvent>(text))
                                        .fold({
                                            async(Dispatchers.IO) {
                                                handleSend(it, outgoing)
                                            }
                                        }) {
                                            val msg = wsCreateErrorEventMessage(
                                                "BadRequest",
                                                "Internal error: ${it.message}"
                                            )
                                            outgoing.send(Frame.Text(jsonParser.encodeToString(msg)))
                                        }
                                }

                                MessageType.REPLAY_START -> sessionService.startReplay(
                                    jsonParser.decodeFromString<ReplayStartEvent>(text)
                                )

                                MessageType.REPLAY_END -> sessionService.endReplay(
                                    jsonParser.decodeFromString<ReplayEndEvent>(text).manifest
                                )

                                MessageType.REPLAY_STOP -> sessionService.stopReplay(
                                    jsonParser.decodeFromString<ReplayStopEvent>(text)
                                )

                                else -> {
                                    val msg = wsCreateErrorEventMessage(
                                        "BadRequest",
                                        "Invalid message type ${msg.manifest.messageType}"
                                    )
                                    outgoing.send(Frame.Text(jsonParser.encodeToString(msg)))
                                }
                            }
                        } catch (e: Exception) {
                            val msg = wsCreateErrorEventMessage("BadRequest", "Unable to read message: ${e.message}")
                            outgoing.send(Frame.Text(jsonParser.encodeToString(msg)))
                        }
                    }
                }
                sessionService.closeSession(session)
            }
        }
    }

    private suspend fun handleSend(channel: Channel<GenericMessageEvent>, sendChannel: SendChannel<Frame>) {
        for (event in channel) {
            sendChannel.send(Frame.Text(Json.encodeToString(event)))
        }
    }
}