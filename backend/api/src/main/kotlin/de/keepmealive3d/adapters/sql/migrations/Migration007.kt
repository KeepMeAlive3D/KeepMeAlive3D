package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration007: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val createScTable = """
                CREATE TABLE IF NOT EXISTS kma.bpm_files(
                    id INT PRIMARY KEY auto_increment,
                    owner INT NOT NULL,
                    dt INT NOT NULL,
                    fileName TEXT NOT NULL
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