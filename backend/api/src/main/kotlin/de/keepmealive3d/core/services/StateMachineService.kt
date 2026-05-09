package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.*
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.repositories.IAnalyzeTraceRepository
import de.keepmealive3d.core.repositories.IStateChartRepository
import de.keepmealive3d.scriptingapi.Plugin
import dev.klenz.matthias.kscxml.KScxml
import dev.klenz.matthias.kscxml.components.KScxmlRootNode
import dev.klenz.matthias.kscxml.components.state.KScxmlState
import kotlinx.coroutines.coroutineScope
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.io.File
import kotlin.io.path.Path

interface IStateMachineService {
    suspend fun createStateMachine(owner: Int, dt: Int, participant: Int, fileBytes: ByteArray, fileName: String)
    fun getStateMachines(owner: Int, dt: Int, participant: Int): List<StateChartInfo>
    fun getStateMachine(owner: Int, dt: Int, participant: Int, id: Int): StateMachine
    fun deleteStateMachine(owner: Int, dt: Int, participant: Int, id: Int)
    suspend fun startStateMachine(owner: Int, dt: Int, participant: Int, fileName: String)
    fun getAllStateMachineFiles(owner: Int, dt: Int, participant: Int): List<File>
    fun updateStateMachine(owner: Int, dt: Int, participant: Int, id: Int, stateMachine: StateMachine)
    fun getStateMachine(id: Int): StateMachine
}

class StateMachineService : KoinComponent, IStateMachineService {
    private val plugins: MutableList<Plugin> by inject()
    private val repo: IStateChartRepository by inject()
    private val analyzerService: IAnalyzeTraceRepository by inject()

    override suspend fun createStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileBytes: ByteArray,
        fileName: String
    ) {
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dt.toString())
            .resolve(participant.toString()).resolve("state-machine").resolve(fileName)
        if (!p.toFile().exists()) {
            coroutineScope {
                p.toFile().parentFile.mkdirs()
                p.toFile().createNewFile()
            }
        }
        p.toFile().writeBytes(fileBytes)
        plugins.forEach { it.registerStateChart(p.toFile()) }
        val scxml = KScxml.load(p.toFile().readText())
        scxml.rootNode?.let {
            val sm = initializeStateMachine(it, p.toFile().name)
            repo.createStateMachine(participant, sm.name, sm)
        } ?: throw BadRequestDataException("Uploaded state chart malformatted")
    }

    override fun getStateMachines(
        owner: Int,
        dt: Int,
        participant: Int
    ): List<StateChartInfo> {
        //todo check if owner actually owns the sc
        return repo.getStateMachines(participant).map { StateChartInfo(it.id, it.name) }
    }

    override fun getStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        id: Int
    ): StateMachine {
        //todo check if owner actually owns the sc
        return repo.getStateMachine(id)
    }

    override fun deleteStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        id: Int
    ) {
        analyzerService.removeByStateMachineId(id)
        repo.deleteStateMachine(id)
    }

    override suspend fun startStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileName: String
    ) {
        plugins.forEach { it.activateStateChart(fileName) }
    }

    override fun getAllStateMachineFiles(
        owner: Int,
        dt: Int,
        participant: Int
    ): List<File> {
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dt.toString())
            .resolve(participant.toString()).resolve("state-machine")
        return p.toFile().walk().maxDepth(1).filter { it.isFile && it.name.endsWith(".xml") }.toList()
    }

    override fun updateStateMachine(owner: Int, dt: Int, participant: Int, id: Int, stateMachine: StateMachine) {
        repo.updateStateMachine(id, stateMachine)
    }

    override fun getStateMachine(id: Int): StateMachine {
        return repo.getStateMachine(id)
    }

    internal fun initializeStateMachine(kScxml: KScxmlRootNode, fileName: String): StateMachine {
        var offsetX = 0
        val offsetY = 225
        val childStates = mutableListOf<StateData>()
        kScxml.states.forEach { state ->
            val child = initializeStates(state, offsetX, offsetY, state.id == kScxml.initial, false)
            childStates.add(child)
            offsetX += child.width
        }

        return StateMachine(
            name = fileName,
            initial = kScxml.initial ?: "unknown",
            states = childStates
        )
    }

    private fun initializeStates(
        state: KScxmlState,
        offsetX: Int = 0,
        offsetY: Int = 225,
        isFirst: Boolean,
        isFinal: Boolean
    ): StateData {
        val childStates = mutableListOf<StateData>()
        var width = 200
        var modOffsetX = offsetX
        var modOffsetY = offsetY
        var childOffsetX = offsetX
        var childOffsetY = offsetY
        childOffsetY += 25
        state.states.forEach {
            val child = initializeStates(
                it,
                childOffsetX,
                childOffsetY,
                state.initial == it.id,
                false,
            )
            childStates.add(child)
            width += child.width + 25
            childOffsetX += child.width + 25
        }
        state.final?.let {
            val child = initializeStates(
                it,
                childOffsetX,
                childOffsetY,
                state.initial == it.id,
                true,
            )
            childStates.add(child)
            width += child.width
        }
        var height = 400 - 2 * (offsetY - 200)
        val type = if (state.states.isEmpty()) StateType.ATOMIC else StateType.SEQUENTIAL
        if (type == StateType.ATOMIC) {
            width = 30
            height = 30
            modOffsetY += 100
            modOffsetX += 100
        }
        val data = StateData(
            id = state.id ?: "unknown",
            stateType = type,
            isFinal = isFinal,
            isFirst = isFirst,
            posX = modOffsetX,
            absX = modOffsetX,
            width = width,
            posY = modOffsetY,
            absY = modOffsetY,
            height = height,
            isActive = false,
            details = StateInfoDetails(
                onEntry = state.onEntry.isNotEmpty(),
                onExit = state.onExit.isNotEmpty(),
                transitions = state.transitions.map {
                    StateTransitionDetails(
                        it.target,
                        it.event,
                        it.cond
                    )
                }
            ),
            childStates = childStates,
            connectedTo = state.transitions.mapNotNull { it.target },
        )
        return data
    }
}