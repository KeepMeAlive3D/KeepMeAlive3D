package de.keepmealive3d

import de.keepmealive3d.config.Config
import de.keepmealive3d.event.LiveDataEventHandler
import de.keepmealive3d.plugins.*
import de.keepmealive3d.scriptingapi.Loader
import de.keepmealive3d.scriptingapi.PluginConfig
import de.keepmealive3d.scriptingapi.mqtt.MqttPlugin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.io.File

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    val conf = Config.load(File("config.yml")).getOrElse {
        log.error("couldn't load config.yml")
        return
    }

    val loader = Loader(conf.pluginDirs.map { File(it) })
    loader.plugins.add(MqttPlugin() to PluginConfig("mqtt", "<none>", "1"))
    val liveDataEventHandler = LiveDataEventHandler()
    runBlocking {   //we want to wait until all plugins are loaded
        loader.plugins.forEach { p ->
            try {
                p.first.onEnable(conf)
            } catch (e: Exception) {
                log.error("could not enable plugin: ${p.second.name}")
                e.printStackTrace()
            }
        }
    }

    launch(Dispatchers.Default, CoroutineStart.DEFAULT) {
        loader.plugins.forEach { p ->
            p.first.registerKtorPlugin(this@module)
        }
    }


    loader.plugins.forEach { p ->
        launch {
            p.first.registerLiveDataAdapter(liveDataEventHandler::receive) { false }
        }
    }

    configureSecurity()
    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureSockets()
    configureRouting()
}
