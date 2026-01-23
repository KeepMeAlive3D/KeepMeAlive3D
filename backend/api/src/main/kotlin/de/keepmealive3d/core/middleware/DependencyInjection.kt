package de.keepmealive3d.core.middleware

import de.keepmealive3d.adapters.influx.KmaInfluxDatabase
import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.ModelDao
import de.keepmealive3d.core.encryption.EncryptionService
import de.keepmealive3d.core.repositories.*
import de.keepmealive3d.core.services.*
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
                single<IWsSessionService> { WsSessionService() }
                single<IDigitalTwinRepository> { DigitalTwinRepository() }
                single<IDigitalTwinService> { DigitalTwinService() }
                single<IProcessParticipantRepository> { ProcessParticipantRepository() }
                single<IProcessParticipantService> { ProcessParticipantService() }
                single<IStateMachineService> { StateMachineService() }
                single<IStateChartRepository> { StateChartRepository() }
                single<IEventLogRepository> { EventLogRepository() }
                single<IEventLogService> { EventLogService() }
                single<IEventLogReplayService> { EventLogReplayService() }
            })
    }
}