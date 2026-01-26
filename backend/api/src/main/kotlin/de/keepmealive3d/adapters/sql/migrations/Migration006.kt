package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration006: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val createScTable = """
                CREATE TABLE IF NOT EXISTS kma.replay_component(
                    id INT PRIMARY KEY auto_increment,
                    owner INT NOT NULL,
                    dt INT NOT NULL,
                    participant INT NOT NULL,
                    logId INT NOT NULL,
                    trace VARCHAR(255) NOT NULL,
                    type VARCHAR(255) NOT NULL,
                    additionalIdentifier TEXT NOT NULL
                );
            """.trimIndent()

            connection.prepareStatement(createScTable).use { statement ->
                statement.executeUpdate()
            }
        }
    }

    override fun down(database: Database) {
        TODO("Not yet implemented")
    }
}