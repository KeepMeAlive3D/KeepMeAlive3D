package de.keepmealive3d

import de.keepmealive3d.adapters.auth.AuthController
import de.keepmealive3d.adapters.auth.RegisterController
import de.keepmealive3d.adapters.auth.UserController
import de.keepmealive3d.adapters.event.EventController
import de.keepmealive3d.adapters.model.ModelDeleteController
import de.keepmealive3d.adapters.model.ModelDownloadController
import de.keepmealive3d.adapters.model.ModelInfoController
import de.keepmealive3d.adapters.model.UploadController
import de.keepmealive3d.adapters.sql.migrations.MigrationRunner
import de.keepmealive3d.adapters.ws.WebsocketConnectionController
import de.keepmealive3d.config.Config
import de.keepmealive3d.core.auth.JWT
import de.keepmealive3d.core.auth.OAuth
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import de.keepmealive3d.core.middleware.*
import de.keepmealive3d.core.services.IWsSessionService
import de.keepmealive3d.core.services.WsSessionService
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

fun Application.appModule(config: Config = Config.load(File("config.yml")).getOrThrow()) {
    val jwt = JWT(config)
    val iniModule = module {
        single { config }
        single { jwt }
        single { log }
        single(qualifier = qualifier("events")) { Channel<GenericMessageEvent>() }
    }

    configureDependencyInjection(iniModule)
    MigrationRunner().executeUp()

    val loader = Loader(config.pluginDirs.map { File(it) })
    //current workaround: MqttPlugin stays in the :api module for better debugging experience
    loader.plugins.add(MqttPlugin() to PluginConfig("mqtt", "<none>", "1"))
    loader.loadPlugins(this, config)
    launch { loader.persistEvents() }

    configureHTTP(config)
    configureMonitoring()
    configureSerialization()
    configureSockets()
    configureRouting()
    configureExceptionHandlingMiddleware()

    install(Authentication) {
        OAuth(this)
        jwt.configureJwt(this)
    }

    WebsocketConnectionController(this)
    RegisterController(this)
    AuthController(this)
    UserController(this)
    UploadController(this)
    ModelInfoController(this)
    ModelDownloadController(this)
    ModelDeleteController(this)
    EventController(this)
}
