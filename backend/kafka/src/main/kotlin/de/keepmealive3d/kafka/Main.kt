package de.keepmealive3d.kafka

import de.keepmealive3d.scriptingapi.Plugin
import io.github.flaxoos.ktor.server.plugins.kafka.*
import io.ktor.client.*
import io.ktor.server.application.*

class Main: Plugin {
    override fun onEnable() {
        return
    }

    override fun registerKtorPlugin(application: Application) {
        application.installKafka {
            schemaRegistryUrl = "my.schemaRegistryUrl"
            val myTopic = TopicName.named("my-topic")
            topic(myTopic) {
                partitions = 1
                replicas = 1
                configs {
                    messageTimestampType = MessageTimestampType.CreateTime
                }
            }
            common { // <-- Define common properties
                bootstrapServers = listOf("my-kafka")
                retries = 1
                clientId = "my-client-id"
            }
            admin { } // <-- Creates an admin client
            producer { // <-- Creates a producer
                clientId = "my-client-id"
            }
            consumer { // <-- Creates a consumer
                groupId = "my-group-id"
                clientId = "my-client-id-override" //<-- Override common properties
            }
            consumerConfig {
                consumerRecordHandler(myTopic) { record ->
                    // Do something with record
                }
            }
            registerSchemas {
                using { // <-- optionally provide a client, by default CIO is used
                    HttpClient()
                }
                //MyRecord::class at myTopic // <-- Will register schema upon startup
            }
        }
    }
}