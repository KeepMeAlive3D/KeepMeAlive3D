package de.keepmealive3d.adapters.sql.tables

import de.keepmealive3d.core.user.LoginType
import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.bytes
import org.ktorm.schema.enum
import org.ktorm.schema.int
import org.ktorm.schema.varchar

interface DBUserEntity : Entity<DBUserEntity> {
    companion object : Entity.Factory<DBUserEntity>()

    val userid: Int
    val loginType: LoginType
    val password: ByteArray
    val name: String
}

object DBUserTable : Table<DBUserEntity>("users") {
    val id = int("id").primaryKey().bindTo { it.userid }
    val loginType = enum<LoginType>("login_type").bindTo { it.loginType }
    val password = bytes("password").bindTo { it.password }
    val name = varchar("name").bindTo { it.name }
}
