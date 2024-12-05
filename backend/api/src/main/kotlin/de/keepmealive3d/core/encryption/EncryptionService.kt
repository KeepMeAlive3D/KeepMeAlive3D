package de.keepmealive3d.core.encryption

import at.favre.lib.crypto.bcrypt.BCrypt
import de.keepmealive3d.config.Config
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class EncryptionService: KoinComponent {
    val config: Config by inject()

    //Hashing
    fun hash(data: String): ByteArray? {
        return BCrypt.withDefaults().hash(7, data.toByteArray())
    }

    fun verifyHash(data: String, hash: ByteArray): Boolean {
        return BCrypt.verifyer().verify(data.toByteArray(), hash).verified
    }
}
