package de.keepmealive3d.adapters.sql

import de.keepmealive3d.adapters.sql.tables.DBUserEntity
import de.keepmealive3d.adapters.sql.tables.DBUserTable
import de.keepmealive3d.config.Config
import de.keepmealive3d.core.user.LoginType
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.database.Database
import org.ktorm.dsl.delete
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.entity.find
import org.ktorm.entity.sequenceOf

class KmaSqlDatabase : KoinComponent {
    val database: Database
    val config: Config by inject()

    init {
        database = Database.connect(
            config.databases.sql.host,
            user = config.databases.sql.user,
            password = config.databases.sql.password
        )
    }

    fun getUser(userid: Int): DBUserEntity? {
        return database.sequenceOf(DBUserTable).find { it.id eq userid }
    }

    fun getUser(username: String): DBUserEntity? {
        return database.sequenceOf(DBUserTable).find { table -> table.name eq username }
    }

    fun deleteUser(userid: Int): Int = database.delete(DBUserTable) {
        it.id eq userid
    }


    fun insertUser(name: String, encryptedPassword: ByteArray, loginType: LoginType) {
        database.insert(DBUserTable) {
            set(it.name, name)
            set(it.password, encryptedPassword)
            set(it.loginType, loginType)
        }
    }
}