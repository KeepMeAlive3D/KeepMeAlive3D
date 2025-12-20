package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.StateData
import de.keepmealive3d.adapters.data.StateInfoDetails
import de.keepmealive3d.adapters.data.StateTransitionDetails
import de.keepmealive3d.core.exceptions.EntityNotFoundException
import de.keepmealive3d.scriptingapi.Plugin
import dev.klenz.matthias.kscxml.KScxml
import dev.klenz.matthias.kscxml.components.state.KScxmlState
import kotlinx.coroutines.coroutineScope
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.io.File
import kotlin.io.path.Path

interface IStateMachineService {
    suspend fun createStateMachine(owner: Int, dt: Int, participant: Int, fileBytes: ByteArray, fileName: String)
    fun getStateMachines(owner: Int, dt: Int, participant: Int): List<String>
    fun getStateMachine(owner: Int, dt: Int, participant: Int, fileName: String): File
    fun getDecodedStateMachine(owner: Int, dt: Int, participant: Int, fileName: String): List<StateData>
    fun deleteStateMachine(owner: Int, dt: Int, participant: Int, fileName: String)
    suspend fun startStateMachine(owner: Int, dt: Int, participant: Int, fileName: String)
}

class StateMachineService : KoinComponent, IStateMachineService {
    private val plugins: MutableList<Plugin> by inject()

    override suspend fun createStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileBytes: ByteArray,
        fileName: String
    ) {
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dt.toString())
            .resolve(participant.toString()).resolve("state-machine").resolve(fileName)
        if(!p.toFile().exists()) {
            coroutineScope {
                p.toFile().parentFile.mkdirs()
                p.toFile().createNewFile()
            }
        }
        p.toFile().writeBytes(fileBytes)
        plugins.forEach { it.registerStateChart(p.toFile()) }
    }

    override fun getStateMachines(
        owner: Int,
        dt: Int,
        participant: Int
    ): List<String> {
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dt.toString())
            .resolve(participant.toString()).resolve("state-machine")
        if(!p.toFile().exists()) {
            return listOf()
        }
        return p.toFile().walk().filter { it.isFile }.map { it.name }.toList()
    }

    override fun getStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileName: String
    ): File {
        val p = Path(System.getProperty("user.dir")).resolve(owner.toString()).resolve(dt.toString())
            .resolve(participant.toString()).resolve("state-machine").resolve(fileName)
        if(!p.toFile().isFile) {
            throw EntityNotFoundException("The file $fileName does not exist!")
        }
        return p.toFile()
    }

    override fun getDecodedStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileName: String
    ): List<StateData> {
        val file = getStateMachine(owner, dt, participant, fileName)
        val scxml = KScxml.load(file.readText())
        return getStateData(
            scxml.rootNode?.initial,
            scxml.rootNode?.states ?: listOf(),
            scxml.rootNode?.final,
            0
        )
    }

    override fun deleteStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileName: String
    ) {
        getStateMachine(owner, dt, participant, fileName).delete()
    }

    override suspend fun startStateMachine(
        owner: Int,
        dt: Int,
        participant: Int,
        fileName: String
    ) {
        plugins.forEach { it.activateStateChart(fileName) }
    }

    private fun getStateData(
        initial: String?,
        states: List<KScxmlState>,
        final: KScxmlState?,
        recursionDepth: Int
    ): MutableList<StateData> {
        val stateData = mutableListOf<StateData>()

        if (states.isEmpty()) {
            return stateData
        }

        states.forEachIndexed { index, state ->
            val lStateData = StateData(
                state.id ?: "df",
                100 + index * 200,
                100 + recursionDepth * 100,
                state.transitions.mapNotNull { it.target }.toMutableList(),
                StateInfoDetails(
                    initial = state.initial,
                    onEntry = state.onEntry.isNotEmpty(),
                    onExit = state.onExit.isNotEmpty(),
                    transitions = state.transitions.map {
                        StateTransitionDetails(
                            it.target,
                            it.event,
                            it.cond
                        )
                    }
                )
            )
            if (initial != null && state.id == initial) {
                stateData.addFirst(lStateData)
            } else {
                stateData.add(lStateData)
            }

            state.states.let { innerStates ->
                stateData.addAll(getStateData(state.initial, innerStates, state.final, recursionDepth + 2))
            }
        }

        return stateData
    }
}