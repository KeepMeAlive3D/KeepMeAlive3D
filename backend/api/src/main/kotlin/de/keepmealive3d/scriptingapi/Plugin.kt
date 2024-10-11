package de.keepmealive3d.scriptingapi

import io.ktor.server.application.*

interface Plugin {
    fun onEnable()
    fun registerKtorPlugin(application: Application)
}