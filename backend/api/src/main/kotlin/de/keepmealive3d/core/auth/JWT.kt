package de.keepmealive3d.core.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTDecodeException
import de.keepmealive3d.config.Config
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import java.time.Instant

class JWT(val config: Config) {
    companion object {
        private const val CLAIM_USERID = "userId"
        private const val CLAIM_USERNAME = "userName"
        private const val jwtIssuer = "de.kma.upload"
        private const val jwtRealm = "de.kma.upload"
        const val EXPIRY = 60L * 60 * 24 * 5
    }

    private val jwtAlgorithm = Algorithm.HMAC512(config.passphrase)
    private val jwtVerifier: JWTVerifier = com.auth0.jwt.JWT
        .require(jwtAlgorithm)
        .withIssuer(jwtIssuer)
        .build()


    /**
     * Generate a token for an authenticated user
     */
    fun generateToken(userId: Int, userName: String): String = JWT.create()
        .withSubject("Authentication")
        .withIssuer(jwtIssuer)
        .withClaim(CLAIM_USERID, userId)
        .withClaim(CLAIM_USERNAME, userName)
        .withExpiresAt(Instant.now().plusSeconds(EXPIRY))
        .sign(jwtAlgorithm)

    fun generateRefreshToken(userId: Int, userName: String) = JWT.create()
        .withSubject("Refresh")
        .withIssuer(jwtIssuer)
        .withClaim(CLAIM_USERID, userId)
        .withClaim(CLAIM_USERNAME, userName)
        .withExpiresAt(Instant.now().plusSeconds(EXPIRY + 60 * 60 * 24 * 10L))
        .sign(jwtAlgorithm)

    fun expireDate(token: String): Result<Instant> {
        val decoded = try {
            JWT.decode(token)
        } catch (e: JWTDecodeException) {
            return Result.failure(e)
        }

        return Result.success(decoded.expiresAtAsInstant)
    }

    fun configureJwt(authConf: AuthenticationConfig) {
        authConf.apply {
            jwt("jwt") {
                verifier(jwtVerifier)
                realm = jwtRealm
                validate {
                    println("Jwt auth called!")
                    val userId = it.payload.getClaim(CLAIM_USERID).asInt()
                    val userName = it.payload.getClaim(CLAIM_USERNAME).asString()
                    if (!it.payload.expiresAtAsInstant.isAfter(Instant.now()))
                        return@validate null
                    println("pass 1")
                    if (userName == null)
                        return@validate null
                    println("pass 2")
                    if (userId == null)
                        return@validate null
                    println("pass 3")

                    val type =
                        if (it.payload.subject == "Authentication") KmaUserPrincipalType.JWT_TOKEN
                        else KmaUserPrincipalType.JWT_REFRESH

                    return@validate KmaUserPrincipal(userId, userName, type)
                }
            }
        }
    }
}