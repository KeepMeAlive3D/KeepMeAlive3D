package de.keepmealive3d.core.model.messages

enum class MessageType {
    TOPIC_DATAPOINT,
    ANIMATION_RELATIVE,
    ERROR,
    SUBSCRIBE_TOPIC,
    REPLAY_START,
    REPLAY_PAUSE,
    REPLAY_END,
    REPLAY_FORWARD,
    STATE_TRANSITION,
    END_MESSAGE
}