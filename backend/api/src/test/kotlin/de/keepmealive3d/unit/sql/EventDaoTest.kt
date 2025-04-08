package de.keepmealive3d.unit.sql

import de.keepmealive3d.adapters.sql.EventDao
import de.keepmealive3d.adapters.sql.KmaSqlDatabase
import de.keepmealive3d.core.event.messages.GenericEventMessage
import de.keepmealive3d.core.event.messages.wsCreateRelativePositionMessageEvent
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.junit.Test
import org.koin.core.component.get
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.core.qualifier.qualifier
import org.koin.dsl.module
import org.koin.test.KoinTest
import org.koin.test.mock.MockProvider
import org.koin.test.mock.declareMock
import org.ktorm.database.Database
import org.ktorm.support.mysql.MySqlDialect
import kotlin.test.AfterTest
import kotlin.test.BeforeTest

class EventDaoTest : KoinTest {
    @BeforeTest
    fun setup() {
        stopKoin()
        startKoin {
            modules(
                module {
                    single(qualifier = qualifier("events")) { Channel<GenericEventMessage>() }
                }
            )
        }
        MockProvider.register { mockkClass(it) }
    }

    @AfterTest
    fun destroy() {
        stopKoin()
    }

    @Test
    fun saveEventDbIsInsertIsCalled() {
        val msg = wsCreateRelativePositionMessageEvent("foo", "bar", 1.0)
        val eventChannel = get<Channel<GenericEventMessage>>(qualifier = qualifier("events"))

        val kmaDbMock = declareMock<KmaSqlDatabase> {}
        val dbMock = declareMock<Database> {}
        every { kmaDbMock.database } returns dbMock
        every { dbMock.dialect } returns MySqlDialect()
        every { dbMock.executeUpdate(any()) } returns 1

        val sut = EventDao()

        runBlocking {
            launch {
                sut.saveEvents()
            }
            eventChannel.send(msg)
            eventChannel.close()
        }

        verify {
            kmaDbMock.database
            dbMock.dialect
            dbMock.executeUpdate(any())
        }
    }
}