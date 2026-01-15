package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration005: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val createScTable = """
                CREATE TABLE IF NOT EXISTS kma.event_logs(
                    id INT PRIMARY KEY auto_increment,
                    owner INT NOT NULL,
                    dt INT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    data JSON NOT NULL
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