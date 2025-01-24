package de.keepmealive3d

import de.keepmealive3d.adapters.auth.AuthController
import de.keepmealive3d.adapters.auth.RegisterController
import de.keepmealive3d.adapters.auth.UserController
import de.keepmealive3d.adapters.event.EventController
import de.keepmealive3d.adapters.model.ModelDeleteController
import de.keepmealive3d.adapters.model.ModelDownloadController
import de.keepmealive3d.adapters.model.UploadController
import de.keepmealive3d.adapters.ws.WebsocketConnectionController
import de.keepmealive3d.config.Config
import de.keepmealive3d.core.auth.JWT
import de.keepmealive3d.core.auth.OAuth
import de.keepmealive3d.core.event.messages.GenericEventMessage
import de.keepmealive3d.plugins.*
import de.keepmealive3d.scriptingapi.Loader
import de.keepmealive3d.scriptingapi.PluginConfig
import de.keepmealive3d.scriptingapi.mqtt.MqttPlugin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import org.koin.core.qualifier.qualifier
import org.koin.dsl.module
import java.io.File

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.appModule() {
    val conf = Config.load(File("config.yml")).getOrElse {
        log.error("couldn't load config.yml")
        log.error(it.message)
        return
    }
    val jwt = JWT(conf)
    val iniModule = module {
        single { conf }
        single { jwt }
        single { log }
        single(qualifier = qualifier("events")) { Channel<GenericEventMessage>() }
    }

    configureDependencyInjection(iniModule)

    val loader = Loader(conf.pluginDirs.map { File(it) })
    //current workaround: MqttPlugin stays in the :api module for better debugging experience
    loader.plugins.add(MqttPlugin() to PluginConfig("mqtt", "<none>", "1"))
    loader.loadPlugins(this, conf)
    launch { loader.persistEvents() }

    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureSockets()
    configureRouting()

    install(Authentication) {
        OAuth(this)
        jwt.configureJwt(this)
    }

    WebsocketConnectionController(this)
    RegisterController(this)
    AuthController(this)
    UserController(this)
    UploadController(this)
    ModelDownloadController(this)
    ModelDeleteController(this)
    EventController(this)
}
