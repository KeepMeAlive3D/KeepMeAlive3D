package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration009: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val create = """
                CREATE TABLE IF NOT EXISTS kma.event_logs
                (
                    id             INT PRIMARY KEY auto_increment,
                    refId          INT     NOT NULL,
                    trace          TEXT    NOT NULL,
                    stateMachineId INT     NOT NULL,
                    stateId        TEXT    NOT NULL,
                    execDuration   BIGINT  NOT NULL
                );
            """.trimIndent()

            connection.prepareStatement(create).use { statement ->
                statement.executeUpdate()
            }
        }
    }

    override fun down(database: Database) {
        TODO("Not yet implemented")
    }
}