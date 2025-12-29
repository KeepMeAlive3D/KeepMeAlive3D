package de.keepmealive3d.unit.service

import de.keepmealive3d.core.services.StateMachineService
import dev.klenz.matthias.kscxml.components.KScxmlRootNode
import dev.klenz.matthias.kscxml.components.state.KScxmlState
import io.mockk.mockkClass
import org.junit.jupiter.api.assertDoesNotThrow
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.test.KoinTest
import org.koin.test.mock.MockProvider
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class StateMachineServiceTest : KoinTest {
    @BeforeTest
    fun setup() {
        stopKoin()
        startKoin {}
        MockProvider.register { mockkClass(it) }
    }

    @AfterTest
    fun destroy() {
        stopKoin()
    }

    @Test
    fun testStateMachineInit() {
        val service = StateMachineService()
        val stateMachine = KScxmlRootNode(
            xmlns = "http://www.w3.org/2005/07/scxml",
            version = "1.0",
            initial = "wrapper",
            datamodel = null,
            name = "test",
            binding = null,
            states = listOf(
                KScxmlState(
                    id = "wrapper",
                    initial = "on",
                    states = listOf(
                        KScxmlState(
                            id = "on",
                        )
                    )
                )
            ),
            final = null
        )

        val sm = service.initializeStateMachine(stateMachine, "test")

        assertEquals(sm.name, "test")
        assertDoesNotThrow {
            sm
                .states
                .first { it.id == "wrapper" }
                .childStates
                .first { it.id == "on" }
        }
    }
}