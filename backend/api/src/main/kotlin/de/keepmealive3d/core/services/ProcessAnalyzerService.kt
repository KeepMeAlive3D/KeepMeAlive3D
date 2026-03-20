package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.TraceTransitionAnalyzeData
import de.keepmealive3d.adapters.data.TraceTransitionLatencyInfo
import de.keepmealive3d.adapters.sql.tables.DBAnalyzeTraceEntity
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import de.keepmealive3d.core.repositories.IAnalyzeTraceRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.LoggerFactory

interface IProcessAnalyzerService {
    fun processTrace(
        owner: Int,
        dtId: Int,
        refId: Int,
        stateMachine: Int,
        trace: String
    ): List<TraceTransitionAnalyzeData>
}

class ProcessAnalyzerService : KoinComponent, IProcessAnalyzerService {
    private val eventLogService: IEventLogService by inject()
    private val stateMachineService: IStateMachineService by inject()
    private val analyzeTraceRepository: IAnalyzeTraceRepository by inject()
    private val logger = LoggerFactory.getLogger("ProcessAnalyzerService")

    override fun processTrace(
        owner: Int,
        dtId: Int,
        refId: Int,
        stateMachine: Int,
        trace: String
    ): List<TraceTransitionAnalyzeData> {
        val refs = eventLogService.getAll(owner, dtId, refId)
        val sm = stateMachineService.getStateMachine(stateMachine)
        val log = refs.firstOrNull { it.type == EventLogTableType.PARTICIPANT && it.typeId == sm.pId.toString() }

        val transitions = analyzeTraceRepository.getTransition(refId, stateMachine, trace)
        if (transitions.isEmpty()) {
            logger.warn("No execution transitions found for $stateMachine and trace $trace")
            return listOf()
        }

        //if one or more conditions for analyzing fails, return the default info without detections
        val analyzeFailedMap = transitions.map {
            TraceTransitionAnalyzeData(
                it.stateId,
                it.previousState,
                it.correlationEvent,
                isErrorState = false,
                isTransitionError = false,
                errorDetectedCycle = false,
                executionDuration = it.execDuration,
                latencyInfo = TraceTransitionLatencyInfo.NORMAL,
                analysisFailed = true
            )
        }

        if (log == null) {
            logger.warn("No event log found for $stateMachine")
            return analyzeFailedMap
        }
        val happyPaths = log.eventLog.traces.filter { it.isHappyPath }
        if (happyPaths.isEmpty()) {
            logger.warn("No happy path for trace $trace")
            return analyzeFailedMap
        }
        if (happyPaths.firstOrNull { it.name == trace } != null) {
            logger.warn("Trace $trace is happy path, skipping analysis")
            return analyzeFailedMap// happy path doesn't need analyzing
        }
        val happyPath = happyPaths
            .map { analyzeTraceRepository.getTransition(refId, stateMachine, it.name ?: "") }
            .firstOrNull { it.isNotEmpty() }
        if (happyPath == null) {
            logger.warn("No happy path transition found for log $refId")
            return analyzeFailedMap
        }

        val traceObj = log.eventLog.traces.firstOrNull { it.name == trace }
        if (traceObj == null) {
            logger.warn("Trace not found for statemachine $stateMachine and trace $trace")
            return analyzeFailedMap
        }


        val happyCopy = mutableListOf<DBAnalyzeTraceEntity>()
        happyCopy.addAll(happyPath)

        val seenStates = mutableSetOf<String>()

        return transitions.map { anTransaction ->
            val happyPathTransition =
                happyCopy.firstOrNull { it.stateId == anTransaction.stateId && it.previousState == anTransaction.previousState }
            val containsState = happyCopy.firstOrNull { it.stateId == anTransaction.stateId }
            var isErrorState = true
            var isTransitionError = true

            if (happyPathTransition != null) {
                happyCopy.remove(happyPathTransition)
                isErrorState = false
                isTransitionError = false
            } else if (containsState != null) {
                happyCopy.remove(containsState)
                isErrorState = false
            }

            val isCycle = seenStates.contains(anTransaction.stateId)
            seenStates.add(anTransaction.stateId)

            TraceTransitionAnalyzeData(
                anTransaction.stateId,
                anTransaction.previousState,
                anTransaction.correlationEvent,
                isErrorState = isErrorState,
                isTransitionError = isTransitionError,
                errorDetectedCycle = isCycle && (isErrorState || isTransitionError),
                executionDuration = anTransaction.execDuration,
                latencyInfo = TraceTransitionLatencyInfo.NORMAL,
                analysisFailed = false
            )
        }
    }
}