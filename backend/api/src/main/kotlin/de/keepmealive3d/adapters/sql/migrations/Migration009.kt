package de.keepmealive3d.adapters.sql.migrations

import org.ktorm.database.Database

class Migration009: Migration {
    override fun up(database: Database) {
        database.useConnection { connection ->
            val create = """
                CREATE TABLE IF NOT EXISTS kma.analyze_trace
                (
                    id                  INT PRIMARY KEY auto_increment,
                    ref_id              INT     NOT NULL,
                    trace               TEXT    NOT NULL,
                    state_machine_id    INT     NOT NULL,
                    previous_state      TEXT    NULL,
                    state_id            TEXT    NOT NULL,
                    exec_duration       BIGINT  NOT NULL,
                    correlation_event   TEXT    NOT NULL
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