package de.keepmealive3d.core.services

import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.LoggerFactory

interface IProcessAnalyzerService {

}

class ProcessAnalyzerService: KoinComponent, IProcessAnalyzerService {
    private val eventLogService: EventLogService by inject()
    private val logger = LoggerFactory.getLogger("ProcessAnalyzerService")


}