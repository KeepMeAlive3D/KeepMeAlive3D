package de.keepmealive3d.adapters.ws

import de.keepmealive3d.core.model.messages.*
import de.keepmealive3d.core.services.IWsSessionService
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.SendChannel
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class WebsocketConnectionController(application: Application) : KoinComponent {
    private val sessionService: IWsSessionService by inject()
    private val jsonParser = Json {
        ignoreUnknownKeys = true
    }

    init {
        application.routing {
            webSocket("/ws") {
                var session: String? = null
                var topics = mutableListOf<String>()
                for (frame in incoming) {
                    if (frame is Frame.Text) {
                        val text = frame.readText()
                        try {
                            val msg = jsonParser.decodeFromString<UnknownTypeEvent>(text)
                            session = msg.manifest.uuid
                            when (msg.manifest.messageType) {
                                MessageType.SUBSCRIBE_TOPIC -> {
                                    val event = jsonParser.decodeFromString<SubscribeEvent>(text)
                                    topics.add(event.message.topic)
                                    sessionService.topicSubscribe(event)
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
                                    jsonParser.decodeFromString<ReplayEndEvent>(text)
                                )

                                MessageType.REPLAY_PAUSE -> sessionService.pauseReplay(
                                    jsonParser.decodeFromString<ReplayPauseEvent>(text)
                                )

                                MessageType.REPLAY_FORWARD -> sessionService.forwardReplay(
                                    jsonParser.decodeFromString<ReplayForwardEvent>(text)
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
                topics.forEach {  topic ->
                    sessionService.closeSession(session, topic)
                }
            }
        }
    }

    private suspend fun handleSend(channel: Channel<GenericMessageEvent>, sendChannel: SendChannel<Frame>) {
        for (event in channel) {
            sendChannel.send(Frame.Text(Json.encodeToString(event)))
        }
    }
}