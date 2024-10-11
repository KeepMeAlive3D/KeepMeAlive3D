package de.keepmealive3d

import de.keepmealive3d.config.Config
import de.keepmealive3d.plugins.*
import de.keepmealive3d.scriptingapi.Loader
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

    val loader = Loader(conf.pluginDirs.map { File(it) })
    loader.plugins.forEach { p ->
        p.first.onEnable()
    }
    loader.plugins.forEach { p ->
        p.first.registerKtorPlugin(this)
    }

    configureSecurity()
    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureSockets()
    configureRouting()
}
