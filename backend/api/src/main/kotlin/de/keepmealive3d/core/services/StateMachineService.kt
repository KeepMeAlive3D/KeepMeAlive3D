package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.*
import de.keepmealive3d.core.exceptions.BadRequestDataException
import de.keepmealive3d.core.repositories.IStateChartRepository
import de.keepmealive3d.scriptingapi.Plugin
import dev.klenz.matthias.kscxml.KScxml
import dev.klenz.matthias.kscxml.components.KScxmlRootNode
import dev.klenz.matthias.kscxml.components.state.KScxmlState
import kotlinx.coroutines.coroutineScope
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import kotlin.io.path.Path

interface IStateMachineService {
    suspend fun createStateMachine(owner: Int, dt: Int, participant: Int, fileBytes: ByteArray, fileName: String)
    fun getStateMachines(owner: Int, dt: Int, participant: Int): List<StateChartInfo>
    fun getStateMachine(owner: Int, dt: Int, participant: Int, id: Int): StateMachine
    fun deleteStateMachine(owner: Int, dt: Int, participant: Int, id: Int)
    suspend fun startStateMachine(owner: Int, dt: Int, participant: Int, fileName: String)
}

class StateMachineService : KoinComponent, IStateMachineService {
    private val plugins: MutableList<Plugin> by inject()
    private val repo: IStateChartRepository by inject()

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
            repo.createStateChart(participant, sm.name, sm)
        } ?: throw BadRequestDataException("Uploaded state chart malformatted")
    }

    override fun getStateMachines(
        owner: Int,
        dt: Int,
        participant: Int
    ): List<StateChartInfo> {
        //todo check if owner actually owns the sc
        return repo.getStateCharts(participant).map { StateChartInfo(it.id, it.name) }
    }

    override fun getStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        id: Int
    ): StateMachine {
        //todo check if owner actually owns the sc
        return repo.getStateChart(id)
    }

    override fun deleteStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        id: Int
    ) {
        repo.deleteStateChart(id)
    }

    override suspend fun startStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileName: String
    ) {
        plugins.forEach { it.activateStateChart(fileName) }
    }

    internal fun initializeStateMachine(kScxml: KScxmlRootNode, fileName: String): StateMachine {
        var offset = 0
        val childStates = mutableListOf<StateData>()
        kScxml.states.forEach { state ->
            val child = initializeStates(state, offset, state.id == kScxml.initial, false)
            childStates.add(child)
            offset += child.width
        }

        return StateMachine(
            fileName,
            kScxml.initial ?: "unknown",
            states = childStates
        )
    }

    private fun initializeStates(
        state: KScxmlState,
        offsetX: Int = 0,
        isFirst: Boolean,
        isFinal: Boolean
    ): StateData {
        val childStates = mutableListOf<StateData>()
        var width = 200
        var childOffset = offsetX
        state.states.forEach {
            val child = initializeStates(
                it,
                childOffset,
                state.initial == it.id,
                false,
            )
            childStates.add(child)
            width += child.width + 25
            childOffset += child.width + 25
        }
        state.final?.let {
            val child = initializeStates(
                it,
                childOffset,
                state.initial == it.id,
                true,
            )
            childStates.add(child)
            width += child.width
        }
        var height = 200
        val type = if (state.states.isEmpty()) StateType.ATOMIC else StateType.SEQUENTIAL
        if (type == StateType.ATOMIC) {
            width = 30
            height = 30
        }
        val data = StateData(
            id = state.id ?: "unknown",
            stateType = type,
            isFinal = isFinal,
            isFirst = isFirst,
            posX = offsetX,
            absX = offsetX,
            width = width,
            posY = 200,
            absY = 200,
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
            connectedTo = childStates.map { it.id },
        )
        return data
    }
}