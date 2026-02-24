package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration008: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val drop = """
                DROP TABLE kma.event_logs;
            """.trimIndent()

            val createNewTable = """
                CREATE TABLE IF NOT EXISTS kma.event_logs
                (
                    id     INT PRIMARY KEY auto_increment,
                    ref    INT                             NOT NULL,
                    owner  INT                             NOT NULL,
                    dt     INT                             NOT NULL,
                    type   ENUM ('PARTICIPANT', 'PROCESS') NOT NULL,
                    typeId TEXT                            NOT NULL,
                    name   TEXT                            NOT NULL,
                    data   JSON                            NOT NULL
                );
            """.trimIndent()
            val createScTable = """
                CREATE TABLE IF NOT EXISTS kma.event_logs_ref
                (
                    id    INT PRIMARY KEY auto_increment,
                    owner INT          NOT NULL,
                    dt    INT          NOT NULL,
                    name  VARCHAR(255) NOT NULL
                );
            """.trimIndent()

            connection.prepareStatement(drop).use { statement ->
                statement.executeUpdate()
            }
            connection.prepareStatement(createNewTable).use { statement ->
                statement.executeUpdate()
            }
            connection.prepareStatement(createScTable).use { statement ->
                statement.executeUpdate()
            }
        }
    }

    override fun down(database: Database) {
        TODO("Not yet implemented")
    }
}