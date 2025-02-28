package de.keepmealive3d.core.encryption

import at.favre.lib.crypto.bcrypt.BCrypt

class EncryptionService {

    //Hashing
    fun hash(data: String): ByteArray? {
        return BCrypt.withDefaults().hash(7, data.toByteArray())
    }

    fun verifyHash(data: String, hash: ByteArray): Boolean {
        return BCrypt.verifyer().verify(data.toByteArray(), hash).verified
    }
}
