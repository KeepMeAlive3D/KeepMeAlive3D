package de.keepmealive3d.core.auth

data class KmaUserPrincipal(
    val userId: Int,
    val userName: String,
    val type: KmaUserPrincipalType
)

enum class KmaUserPrincipalType {
    JWT_TOKEN,
    JWT_REFRESH,
    BASIC,
    OAUTH
}