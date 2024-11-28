package de.keepmealive3d.plugins

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.encryption.EncryptionService
import io.ktor.server.application.*
import org.koin.core.module.Module
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureDependencyInjection(initModule: Module) {
    install(Koin) {
        slf4jLogger()
        modules(
            initModule,
            module {
                single { KmaSqlDatabase() }
                single { EncryptionService() }
            })
    }
}