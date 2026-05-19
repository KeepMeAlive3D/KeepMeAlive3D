package de.keepmealive3d.scriptingapi

import de.keepmealive3d.config.Config
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import io.ktor.server.application.*
import java.io.File

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

    /**
     * when a user uploads a SCXML formatted file this hook is called with the file content
     */
    open suspend fun registerStateChart(file: File) {
        return
    }

    /**
     * indicates that a user wants to execute a state chart, the plugin should start executing at this point the state chart.
     */
    open suspend fun activateStateChart(chart: String) {
        return
    }

    /**
     * when the state chart is rendered this hook is called to get all active states
     */
    open suspend fun getActiveStateChartStates(chart: String): List<String> {
        return emptyList()
    }

    /**
     * a hook back into the app to force updates in the state chart ui
     * @param callback a hook where the plugin provides the chart name (filename), the state id to transition from,
     * the state id to transition to
     */
    open suspend fun registerStateChangeListener(callback: suspend (chart: String, from: String, to: String) -> Unit) {
        return
    }
}