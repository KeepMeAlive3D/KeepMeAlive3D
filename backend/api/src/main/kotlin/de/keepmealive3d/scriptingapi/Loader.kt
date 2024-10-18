package de.keepmealive3d.scriptingapi

import com.charleskorn.kaml.PolymorphismStyle
import com.charleskorn.kaml.Yaml
import de.keepmealive3d.config.Config
import de.keepmealive3d.event.LiveDataEventHandler
import io.ktor.server.application.*
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.decodeFromString
import java.io.File
import java.net.URLClassLoader
import kotlin.reflect.full.createInstance

class Loader(private val pluginDirectories: List<File>) {
    private val yamlParser = createYamlParser()
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
        val liveDataEventHandler = LiveDataEventHandler()
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
                p.first.registerLiveDataAdapter(liveDataEventHandler::receive) { false }
            }
        }
    }

    private fun createYamlParser(): Yaml {
        val yamlConfig = Yaml.default.configuration.copy(
            polymorphismStyle = PolymorphismStyle.Property,
            polymorphismPropertyName = "type",
        )
        return Yaml(Yaml.default.serializersModule, yamlConfig)
    }
}