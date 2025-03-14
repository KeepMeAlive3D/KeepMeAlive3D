package de.keepmealive3d.core.middleware

import de.keepmealive3d.adapters.data.RestErrorInfo
import de.keepmealive3d.core.exceptions.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

fun Application.configureExceptionHandlingMiddleware() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            val info: RestErrorInfo = handleException(cause)
            call.respond(HttpStatusCode.fromValue(info.code), info)
        }
    }
}

private fun handleException(e: Throwable): RestErrorInfo {
    return when (e) {
        is BadRequestData -> RestErrorInfo(
            "Invalid data provided",
            e.description,
            HttpStatusCode.BadRequest.value
        )

        is EntityAlreadyExistsException -> RestErrorInfo(
            "Entity already exists",
            e.description,
            HttpStatusCode.Conflict.value
        )

        is EntityNotFoundException -> RestErrorInfo(
            "Entity not found",
            e.description,
            HttpStatusCode.NotFound.value
        )

        is InvalidAuthTokenException -> RestErrorInfo(
            "Invalid authentication token",
            e.description,
            HttpStatusCode.Unauthorized.value
        )

        is InvalidCredentialsException -> RestErrorInfo(
            "Invalid credentials provided",
            e.description,
            HttpStatusCode.Forbidden.value
        )

        is PersistenceException -> RestErrorInfo(
            "Persistence error",
            e.description,
            HttpStatusCode.InternalServerError.value
        )

        else -> {
            e.printStackTrace()
            RestErrorInfo(
                "Internal Server Error",
                e.message ?: "",
                HttpStatusCode.InternalServerError.value
            )
        }
    }
}