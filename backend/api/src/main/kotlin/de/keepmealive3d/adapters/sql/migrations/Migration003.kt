package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration003: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val createDtTable = """
                CREATE TABLE IF NOT EXISTS kma.digital_twins(
                    id INT PRIMARY KEY auto_increment,
                    owner INT NOT NULL,
                    name TEXT NOT NULL,
                    icon INT DEFAULT 0
                );
            """.trimIndent()

            val createParticipantTable = """
                CREATE TABLE IF NOT EXISTS kma.process_participants(
                    id INT PRIMARY KEY auto_increment,
                    owner INT NOT NULL,
                    dt INT NOT NULL,
                    name TEXT NOT NULL,
                    icon INT DEFAULT 0
                );
            """.trimIndent()

            connection.prepareStatement(createDtTable).use { statement ->
                statement.executeUpdate()
            }

            connection.prepareStatement(createParticipantTable).use { statement ->
                statement.executeUpdate()
            }
        }
    }

    override fun down(database: Database) {
        return
    }
}