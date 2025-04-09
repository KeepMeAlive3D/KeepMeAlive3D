package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration001: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val createUserTable = """
                CREATE TABLE IF NOT EXISTS kma.users(
                    id         INT PRIMARY KEY auto_increment,
                    login_type ENUM ('OAUTH', 'BASIC') NOT NULL,
                    password   VARBINARY(255),
                    name       VARCHAR(255) UNIQUE
                );
            """.trimIndent()
            val createEventsTable = """
                CREATE TABLE IF NOT EXISTS kma.events(
                    id        INT PRIMARY KEY auto_increment,
                    type      ENUM ('TOPIC_DATAPOINT','ANIMATION_RELATIVE','ERROR','SUBSCRIBE_TOPIC') NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    source    VARCHAR(255)                                                            NOT NULL,
                    topic     VARCHAR(255)                                                            NOT NULL,
                    data      VARCHAR(255)
                );
            """.trimIndent()
            val createModelsTable = """
                CREATE TABLE IF NOT EXISTS kma.models(
                    id              INT PRIMARY KEY auto_increment,
                    filename        VARCHAR(255) NOT NULL,
                    model_name      VARCHAR(255) NOT NULL,
                    owner           INT          NOT NULL,
                    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    light_intensity DOUBLE    DEFAULT 1.0,
                    scale           DOUBLE    DEFAULT 1.0
                );
            """.trimIndent()

            connection.prepareStatement(createUserTable).use { statement ->
                statement.executeUpdate()
            }
            connection.prepareStatement(createEventsTable).use { statement ->
                statement.executeUpdate()
            }
            connection.prepareStatement(createModelsTable).use { statement ->
                statement.executeUpdate()
            }
        }

    }

    override fun down(database: Database) {
        TODO("Not yet implemented")
    }
}