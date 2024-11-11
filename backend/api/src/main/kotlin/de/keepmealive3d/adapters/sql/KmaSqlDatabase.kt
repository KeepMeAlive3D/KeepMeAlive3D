package de.keepmealive3d.adapters.sql

import de.keepmealive3d.adapters.sql.tables.DBUserEntity
import de.keepmealive3d.adapters.sql.tables.DBUserTable
import de.keepmealive3d.config.Config
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.database.Database
import org.ktorm.dsl.eq
import org.ktorm.entity.find
import org.ktorm.entity.sequenceOf

class KmaSqlDatabase : KoinComponent {
    val database: Database
    val config: Config by inject()

    init {
        database = Database.connect(
            "jdbc:mysql://${config.databases.sql.host}:${config.databases.sql.port}/${config.databases.sql.schema}",
            user = config.databases.sql.user,
            password = config.databases.sql.password
        )
    }

    fun getUser(userid: Int): DBUserEntity? {
        return database.sequenceOf(DBUserTable).find { it.id eq userid }
    }
}