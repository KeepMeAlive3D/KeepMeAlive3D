package de.keepmealive3d.core.services

import org.koin.core.component.KoinComponent

interface IEventLogReplayService {
    fun startReplay(owner: Int, dt: Int, id: Int, trace: String)
    fun stop(owner: Int, dt: Int, id: Int, trace: String)
}

class EventLogReplayService: KoinComponent, IEventLogReplayService {
    override fun startReplay(owner: Int, dt: Int, id: Int, trace: String) {
        TODO("Not yet implemented")
    }

    override fun stop(owner: Int, dt: Int, id: Int, trace: String) {
        TODO("Not yet implemented")
    }
}