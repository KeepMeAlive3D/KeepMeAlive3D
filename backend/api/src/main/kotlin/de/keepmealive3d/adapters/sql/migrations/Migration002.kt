package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration002 : Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val dropExistingTable = """
                DROP TABLE events
            """.trimIndent()
            val alterEventTypeEnum = """
                CREATE TABLE IF NOT EXISTS kma.events(
                    id        INT PRIMARY KEY auto_increment,
                    type      ENUM ('TOPIC_DATAPOINT','ANIMATION_RELATIVE','ERROR','SUBSCRIBE_TOPIC') NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    source    VARCHAR(255)                                                            NOT NULL,
                    topic     VARCHAR(255)                                                            NOT NULL,
                    data      VARCHAR(255)
                );
                """.trimIndent()
            connection.prepareStatement(dropExistingTable).use { statement ->
                statement.executeUpdate()
            }
            connection.prepareStatement(alterEventTypeEnum).use { statement ->
                statement.executeUpdate()
            }
        }

    }

    override fun down(database: Database) {
        TODO("Not yet implemented")
    }
}