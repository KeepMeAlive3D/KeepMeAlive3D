package de.keepmealive3d.core.middleware

import de.keepmealive3d.adapters.influx.KmaInfluxDatabase
import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.ModelDao
import de.keepmealive3d.core.encryption.EncryptionService
import de.keepmealive3d.core.model.IModelService
import de.keepmealive3d.core.model.ModelRepository
import de.keepmealive3d.core.model.ModelService
import de.keepmealive3d.core.persistence.IModelDao
import de.keepmealive3d.core.persistence.IModelRepository
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
                single { EventDao() }
                single { EncryptionService() }
                single { KmaInfluxDatabase() }
                single<IModelRepository> { ModelRepository() }
                single<IModelDao> { ModelDao() }
                single<IModelService> { ModelService() }
            })
    }
}