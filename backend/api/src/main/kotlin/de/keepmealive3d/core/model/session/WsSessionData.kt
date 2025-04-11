package de.keepmealive3d.core.model.session

import de.keepmealive3d.core.model.messages.GenericMessageEvent
import kotlinx.coroutines.Job
import kotlinx.coroutines.channels.Channel
import java.time.Instant
import java.util.UUID

data class WsSessionData(
    val uuid: UUID,
    val channels: MutableList<WsSessionChannelData>,
    var replayStart: Instant? = null,
    var replayEnd: Instant? = null,
    var replayState: ReplayState = ReplayState.NOT_IN_REPLAY,
    var replayJob: Job? = null,
)

data class WsSessionChannelData(
    val topic: String,
    val channel: Channel<GenericMessageEvent>
)

enum class ReplayState {
    RUNNING,
    STOPPED,
    NOT_IN_REPLAY,
}