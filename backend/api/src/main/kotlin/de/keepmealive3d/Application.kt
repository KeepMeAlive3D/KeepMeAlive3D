package de.keepmealive3d

import de.keepmealive3d.adapters.controllers.AnalyzeProcessController
import de.keepmealive3d.adapters.controllers.AuthController
import de.keepmealive3d.adapters.controllers.BpmController
import de.keepmealive3d.adapters.controllers.DigitalTwinController
import de.keepmealive3d.adapters.controllers.RegisterController
import de.keepmealive3d.adapters.controllers.UserController
import de.keepmealive3d.adapters.controllers.EventController
import de.keepmealive3d.adapters.controllers.EventLogController
import de.keepmealive3d.adapters.controllers.ModelDeleteController
import de.keepmealive3d.adapters.controllers.ModelDownloadController
import de.keepmealive3d.adapters.controllers.ModelInfoController
import de.keepmealive3d.adapters.controllers.ProcessParticipantController
import de.keepmealive3d.adapters.controllers.ReplayController
import de.keepmealive3d.adapters.controllers.ReplayLogComponentsController
import de.keepmealive3d.adapters.controllers.StateMachineController
import de.keepmealive3d.adapters.controllers.UploadController
import de.keepmealive3d.adapters.sql.migrations.MigrationRunner
import de.keepmealive3d.adapters.ws.WebsocketConnectionController
import de.keepmealive3d.config.Config
import de.keepmealive3d.core.auth.JWT
import de.keepmealive3d.core.auth.OAuth
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import de.keepmealive3d.core.middleware.*
import de.keepmealive3d.scriptingapi.Loader
import de.keepmealive3d.scriptingapi.Plugin
import de.keepmealive3d.scriptingapi.PluginConfig
import de.keepmealive3d.scriptingapi.kscxml.KScxmlExecutorPlugin
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
        single { mutableListOf<Plugin>() }
    }

    configureDependencyInjection(iniModule)
    MigrationRunner().executeUp()

    val loader = Loader(config.pluginDirs.map { File(it) })
    //current workaround: MqttPlugin stays in the :api module for better debugging experience
    loader.plugins.add(MqttPlugin() to PluginConfig("mqtt", "<none>", "1"))
    loader.plugins.add(KScxmlExecutorPlugin() to PluginConfig("scxml", "<none>", "1"))
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
    DigitalTwinController(this)
    ProcessParticipantController(this)
    StateMachineController(this)
    EventLogController(this)
    ReplayLogComponentsController(this)
    BpmController(this)
    AnalyzeProcessController(this)
    ReplayController(this)
}
