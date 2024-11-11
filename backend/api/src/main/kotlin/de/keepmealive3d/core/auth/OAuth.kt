package de.keepmealive3d.core.auth

import de.keepmealive3d.config.Config
import io.ktor.client.HttpClient
import io.ktor.http.HttpMethod
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.OAuthServerSettings
import io.ktor.server.auth.oauth
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class OAuth(application: Application): KoinComponent {
    val config: Config by inject()

    init {
        val redirects = mutableMapOf<String, String>()
        application.install(Authentication) {
            oauth("oauth") {
                // Configure oauth authentication
                urlProvider = { "http://localhost:8080/callback" }
                providerLookup = {
                    OAuthServerSettings.OAuth2ServerSettings(
                        name = "google",
                        authorizeUrl = "https://accounts.google.com/o/oauth2/auth",
                        accessTokenUrl = "https://accounts.google.com/o/oauth2/token",
                        requestMethod = HttpMethod.Post,
                        clientId = System.getenv("GOOGLE_CLIENT_ID"),
                        clientSecret = System.getenv("GOOGLE_CLIENT_SECRET"),
                        defaultScopes = listOf("https://www.googleapis.com/auth/userinfo.profile"),
                        extraAuthParameters = listOf("access_type" to "offline"),
                        onStateCreated = { call, state ->
                            //saves new state with redirect url value
                            call.request.queryParameters["redirectUrl"]?.let {
                                redirects[state] = it
                            }
                        }
                    )
                }
                client = HttpClient()
            }
        }
    }
}