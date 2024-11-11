package de.keepmealive3d.plugins

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.config.Config
import io.ktor.server.application.Application
import io.ktor.server.application.install
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureDependencyInjection(config: Config) {
    // Install Koin
    install(Koin) {
        slf4jLogger()
        modules(module {
            single { config }
            single { KmaSqlDatabase() }
        })
    }
}