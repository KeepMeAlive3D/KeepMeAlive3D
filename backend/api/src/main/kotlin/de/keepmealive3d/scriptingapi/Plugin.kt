package de.keepmealive3d.scriptingapi

import de.keepmealive3d.config.Config
import de.keepmealive3d.core.event.messages.GenericEventMessage
import io.ktor.server.application.*

abstract class Plugin {
    open suspend fun onEnable(config: Config) {
        return
    }

    open suspend fun registerKtorPlugin(application: Application) {
        return
    }

    open suspend fun registerLiveDataAdapter(
        rcv: suspend (msg: GenericEventMessage) -> Unit,
        interruptCallback: () -> Boolean
    ) {
        return
    }
}