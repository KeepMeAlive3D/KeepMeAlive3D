package de.keepmealive3d.scriptingapi

import com.charleskorn.kaml.PolymorphismStyle
import com.charleskorn.kaml.Yaml
import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.config.Config
import de.keepmealive3d.core.model.messages.GenericMessageEvent
import de.keepmealive3d.core.services.IWsSessionService
import io.ktor.server.application.*
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.decodeFromString
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.koin.core.qualifier.qualifier
import java.io.File
import java.net.URLClassLoader
import kotlin.reflect.full.createInstance

class Loader(private val pluginDirectories: List<File>): KoinComponent {
    private val yamlParser = createYamlParser()
    private val eventChannel: Channel<GenericMessageEvent> by inject(qualifier = qualifier("events"))
    private val sessionService: IWsSessionService by inject()
    private val eventDao: EventDao by inject()

    val plugins: MutableList<Pair<Plugin, PluginConfig>> by lazy {
        val uris = pluginDirectories
            .map {
                it
                    .walk()                           //traverse plugin directory
                    .maxDepth(1)                //don't look into subdirectories
                    .filter { file -> file.isFile && file.extension == "jar" }   // only accept jar files
                    .toList()                         //map only works on lists
                    .map { file -> file.toURI().toURL() }   //map to urls for classloader
            }
            .flatten()      //make list of lists to a flat list
            .toTypedArray() //create array for classloader
        val classLoader = URLClassLoader(uris, this::class.java.classLoader)
        classLoader.getResources("plugin.yml").asSequence().map {
            val conf = yamlParser.decodeFromString<PluginConfig>(it.readText(Charsets.UTF_8))
            val classToLoad = classLoader.loadClass(conf.main)
            (classToLoad.kotlin.createInstance() as Plugin) to conf
        }.toList().toMutableList()
    }

    fun loadPlugins(application: Application, conf: Config) = with(application) {
        runBlocking {   //we want to wait until all plugins are loaded
            plugins.forEach { p ->
                try {
                    p.first.onEnable(conf)
                } catch (e: Exception) {
                    log.error("could not enable plugin: ${p.second.name}")
                    e.printStackTrace()
                }
            }
        }
        launch(Dispatchers.Default, CoroutineStart.DEFAULT) {
            plugins.forEach { p ->
                p.first.registerKtorPlugin(this@with)
            }
        }
        plugins.forEach { p ->
            launch {
                p.first.registerLiveDataAdapter(::receive) { false }
            }
        }
    }

    suspend fun persistEvents() {
        eventDao.saveEvents()
    }

    private fun createYamlParser(): Yaml {
        val yamlConfig = Yaml.default.configuration.copy(
            polymorphismStyle = PolymorphismStyle.Property,
            polymorphismPropertyName = "type",
        )
        return Yaml(Yaml.default.serializersModule, yamlConfig)
    }

    private suspend fun receive(msg: GenericMessageEvent) {
        sessionService.distributeLiveEvent(msg)
        eventChannel.trySend(msg)
    }
}