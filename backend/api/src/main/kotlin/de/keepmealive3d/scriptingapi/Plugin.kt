package de.keepmealive3d.scriptingapi

import de.keepmealive3d.config.Config
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import io.ktor.server.application.*

abstract class Plugin {

    /**
     * called when all plugins are loaded
     */
    open suspend fun onEnable(config: Config) {
        return
    }

    /**
     * get access to the ktor framework to register new routes or plugins
     */
    open suspend fun registerKtorPlugin(application: Application) {
        return
    }

    /**
     * register a new adapter to send new data points, positions or rotations
     * @param rcv function to call when a new event occurred. See [de.keepmealive3d.core.model.messages.DataPointMessageEvent] and [de.keepmealive3d.core.model.messages.RelativePositionMessageEvent]
     * @param interruptCallback becomes true when the adapter goes out of scope, e.g. application stop
     */
    open suspend fun registerLiveDataAdapter(
        rcv: suspend (msg: GenericMessageEvent) -> Unit,
        interruptCallback: () -> Boolean
    ) {
        return
    }
}