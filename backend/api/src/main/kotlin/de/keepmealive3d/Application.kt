package de.keepmealive3d

import de.keepmealive3d.config.Config
import de.keepmealive3d.core.TestUser
import de.keepmealive3d.plugins.*
import de.keepmealive3d.scriptingapi.Loader
import de.keepmealive3d.scriptingapi.PluginConfig
import de.keepmealive3d.scriptingapi.mqtt.MqttPlugin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
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
    configureDependencyInjection(conf)

    val loader = Loader(conf.pluginDirs.map { File(it) })
    //current workaround: MqttPlugin stays in the :api module for better debugging experience
    loader.plugins.add(MqttPlugin() to PluginConfig("mqtt", "<none>", "1"))
    loader.loadPlugins(this, conf)

    configureSecurity()
    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureSockets()
    configureRouting()

    TestUser(this)
}
