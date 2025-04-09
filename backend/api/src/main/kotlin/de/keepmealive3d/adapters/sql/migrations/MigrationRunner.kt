package de.keepmealive3d.adapters.sql.migrations

import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.adapters.sql.tables.DBKmaMigrationsTable
import de.keepmealive3d.adapters.sql.tables.DKmaMigrationsEntity
import de.keepmealive3d.config.Config
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.ktorm.database.Database
import org.ktorm.dsl.insert
import org.ktorm.entity.sequenceOf
import org.ktorm.entity.toList

class MigrationRunner : KoinComponent {
    private val kmaDb: KmaSqlDatabase by inject()
    private val config: Config by inject()

    private val allMigrations = mapOf<Int, Migration>(
        1 to Migration001(),
        2 to Migration002(),
    )

    fun executeUp() {
        val existingMigrations = getDbMigrations()
        allMigrations.forEach { (id, migration) ->
            if (existingMigrations.none { it.id == id }) {
                migration.up(kmaDb.database)
                migrationExecuted(id)
            }
        }
    }

    private fun migrationExecuted(id: Int) {
        kmaDb.database.insert(DBKmaMigrationsTable) {
            set(it.internalId, id)
        }
    }

    private fun getDbMigrations(): List<DKmaMigrationsEntity> {
        val migrationDB = Database.connect(
            config.databases.sqlMigrate.host,
            null,
            config.databases.sqlMigrate.user,
            config.databases.sqlMigrate.password
        )
        migrationDB.useConnection { connection ->
            val createSchema = """
                CREATE SCHEMA IF NOT EXISTS kma;
            """.trimIndent()
            val createMigrations = """
                CREATE TABLE IF NOT EXISTS kma.migrations
                (
                    id          INT PRIMARY KEY AUTO_INCREMENT,
                    internal_id INT             NOT NULL
                )
            """.trimIndent()

            connection.prepareStatement(createSchema).use { statement ->
                statement.executeUpdate()
            }
            connection.prepareStatement(createMigrations).use { statement ->
                statement.executeUpdate()
            }
        }

        return kmaDb.database.sequenceOf(DBKmaMigrationsTable).toList()
    }
}

interface Migration {
    fun up(database: Database)
    fun down(database: Database)
}