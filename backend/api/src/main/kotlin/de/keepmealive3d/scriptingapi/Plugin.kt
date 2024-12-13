package de.keepmealive3d.scriptingapi

import de.keepmealive3d.config.Config
import io.ktor.server.application.*

abstract class Plugin {
    open suspend fun onEnable(config: Config) {
        return
    }

    open suspend fun registerKtorPlugin(application: Application) {
        return
    }

    open suspend fun registerLiveDataAdapter(
        rcv: suspend (dataSource: String, topic: String, value: String) -> Unit,
        interruptCallback: () -> Boolean
    ) {
        return
    }
}