package de.keepmealive3d.adapters.sql.tables

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int

interface DBUserEntity : Entity<DBUserEntity> {
    companion object : Entity.Factory<DBUserEntity>()

    val userid: Int
    val loginType: Int
}

object DBUserTable : Table<DBUserEntity>("user") {
    val id = int("id").primaryKey()
    val loginType = int("login_type")
}
