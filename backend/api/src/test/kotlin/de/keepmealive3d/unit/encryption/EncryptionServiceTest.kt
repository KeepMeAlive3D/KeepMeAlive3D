package de.keepmealive3d.unit.encryption

import de.keepmealive3d.core.encryption.EncryptionService
import kotlin.test.Test

class EncryptionServiceTest {

    @Test
    fun testEncryption() {
        val sut = EncryptionService()

        val pass = "foo"
        val h = sut.hash(pass)

        assert(sut.verifyHash(pass, h!!))
    }
}