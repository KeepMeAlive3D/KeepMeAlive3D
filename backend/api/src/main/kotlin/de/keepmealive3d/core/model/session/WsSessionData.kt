package de.keepmealive3d.core.model.session

import de.keepmealive3d.core.model.messages.GenericMessageEvent
import kotlinx.coroutines.channels.Channel
import java.util.*

data class WsSessionData(
    val uuid: UUID,
    val channels: MutableList<WsSessionChannelData>,
)

data class WsSessionChannelData(
    val topic: String,
    val channel: Channel<GenericMessageEvent>
)