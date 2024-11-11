package de.keepmealive3d.core.auth

import de.keepmealive3d.config.KafkaDatabase
import io.ktor.server.application.Application
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class Basic(application: Application): KoinComponent {
    val database: KafkaDatabase by inject()

    init {

    }
}