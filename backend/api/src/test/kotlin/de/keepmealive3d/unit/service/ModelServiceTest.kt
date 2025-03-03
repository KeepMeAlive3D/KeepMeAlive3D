package de.keepmealive3d.unit.service

import de.keepmealive3d.adapters.data.ModelInfo
import de.keepmealive3d.core.model.ModelService
import de.keepmealive3d.core.persistence.IModelDao
import de.keepmealive3d.core.persistence.IModelRepository
import io.mockk.every
import io.mockk.mockkClass
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.test.KoinTest
import org.koin.test.mock.MockProvider
import org.koin.test.mock.declareMock
import java.io.File
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class ModelServiceTest : KoinTest {
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
    fun createModelHappyPathFileCreated() {
        //given
        val modelRepoMock = declareMock<IModelRepository> { }
        val modelDaoMock = declareMock<IModelDao> { }
        val modelFile = File.createTempFile("foo", "bar")
        val fileContent = "baz".toByteArray()

        every { modelRepoMock.createUniqueFileLocation(0, "foo", "bar") } returns modelFile.toPath()
        every { modelDaoMock.create(0, any(), any()) } returns 1

        //execute
        val sut = ModelService()
        sut.createNewModel(0, "foo", "bar", fileContent)

        //check
        assertEquals("baz", modelFile.readText())

        //cleanup
        modelFile.delete()
    }

    @Test
    fun getModelHappyPathReturnsPath() {
        //given
        val modelRepoMock = declareMock<IModelRepository> { }
        val modelDaoMock = declareMock<IModelDao> { }
        val modelFile = File.createTempFile("foo", "bar")

        every { modelDaoMock.getModelById(123) } returns ModelInfo(123, "foo", "bar")
        every { modelRepoMock.getModelLocation(123, "bar", "foo") } returns modelFile.toPath()

        //execute
        val sut = ModelService()
        val actual = sut.getRequiredModelLocation(123, 123)

        //check
        assertEquals(modelFile.toPath(), actual)
    }
}