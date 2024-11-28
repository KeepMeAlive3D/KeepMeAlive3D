package de.keepmealive3d.core.auth

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.config.KafkaDatabase
import de.keepmealive3d.core.encryption.EncryptionService
import io.ktor.server.application.Application
import io.ktor.server.auth.AuthenticationConfig
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.authentication
import io.ktor.server.auth.basic
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class Basic(authConfig: AuthenticationConfig): KoinComponent {
    val database: KmaSqlDatabase by inject()
    val encryptionService: EncryptionService by inject()

    init {
        authConfig.apply {
            basic(name = "basic") {
                realm = "KMA Basic"
                validate { credentials ->
                    val dbUser = database.getUser(credentials.name)

                    if(dbUser == null) {
                        return@validate null
                    }
                    if(encryptionService.verifyHash(credentials.password, dbUser.password)) {
                        return@validate KmaUserPrincipal(dbUser.userid, dbUser.name, KmaUserPrincipalType.BASIC)
                    }
                    return@validate null
                }
            }
        }
    }
}