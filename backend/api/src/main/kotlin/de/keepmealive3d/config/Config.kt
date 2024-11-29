package de.keepmealive3d.config

import com.charleskorn.kaml.PolymorphismStyle
import com.charleskorn.kaml.Yaml
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import kotlinx.serialization.decodeFromString
import java.io.File

@Serializable
data class Config(
    val passphrase: String,
    val databases: Databases,
    val pluginDirs: List<String>
) {
    companion object {
        fun load(file: File): Result<Config> {
            val yamlConfig = Yaml.default.configuration.copy(
                polymorphismStyle = PolymorphismStyle.Property,
                polymorphismPropertyName = "type",
                strictMode = false
            )
            val parser = Yaml(Yaml.default.serializersModule, yamlConfig)
            return try {
                Result.success(parser.decodeFromString<Config>(file.readText()))
            } catch (exception: IllegalArgumentException) {
                Result.failure(exception)
            }
        }
    }
}

@Serializable
data class Databases(
    val sql: SqlDatabase,
    val kafka: KafkaDatabase,
    val mqtt: MqttDatabase,
    val influx: InfluxDatabase
)

@Serializable
data class SqlDatabase(
    val host: String,
    val port: Int,
    val user: String,
    val password: String,
    val schema: String
)

@Serializable
data class KafkaDatabase(
    val host: String,
    val port: Int,
    val password: String
)

@Serializable
data class MqttDatabase(
    val host: String,
    val port: Int,
    val clientId: String,
    val password: String,
    val topic: String,
)

@Serializable
data class InfluxDatabase(
    val host: String,
    val port: Int,
    val org: String,
    val bucket: String,
    val token: String,
)