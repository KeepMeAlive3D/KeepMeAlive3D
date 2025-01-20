package de.keepmealive3d.core.model

import de.keepmealive3d.adapters.model.ModelDownloadController
import de.keepmealive3d.core.auth.JWT
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.Logger
import java.io.File
import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.random.Random

class ModelRepository : KoinComponent {

    val log: Logger by inject()

    /**
     * reruns a path to a valid location to save a model to
     */
    fun createUniqueFileLocation(userid: Int, path: String, name: String): Path {
        val userModelPath =
            Path(System.getProperty("user.dir")).resolve("models").resolve(userid.toString()).resolve(path)
        userModelPath.createDirectories()
        val filePath = if (userModelPath.resolve(name).exists()) {
            userModelPath.resolve(name + Random.nextBytes(4).toString())
        } else {
            userModelPath.resolve(name)
        }
        return filePath
    }

    /**
     * checks if the model file exist
     * @return the path to the file or null if it does not exist
     */
    fun getModelLocation(userid: Int, model: String, fileName: String): Path? {
        val userModelPath = Path(System.getProperty("user.dir")).resolve("models").resolve(userid.toString())
        if (userModelPath.resolve(model).resolve(fileName).exists()) {
            return userModelPath.resolve(model).resolve(fileName)
        }
        return null
    }

    /**
     * @return all uploaded files by a user
     */
    fun getAllModelFileNames(userid: Int): Set<ModelDownloadController.ModelInfo> {
        val userModelPath = Path(System.getProperty("user.dir")).resolve("models").resolve(userid.toString())
        return userModelPath
            .toFile()
            .walk()
            .filter { it.isFile }
            .map { file ->
                val path = file.absolutePath.removePrefix(userModelPath.toString()).removePrefix(File.separator)
                val split = path.split(File.separator)

                if (split.size != 2) {
                    log.warn("Could not load file '" + file.name + "'. Invalid file or path.")
                    return@map null
                }

                val (modelName, fileName) = split

                return@map ModelDownloadController.ModelInfo(
                    fileName,
                    modelName,
                )
            }
            .filterNotNull()
            .toSet()
    }

    /**
     * deletes a file for a user
     * @return true if the file was deleted, false if no file was found or there where fs problems
     */
    fun deleteFile(userid: Int, model: String, fileName: String): Boolean {
        return getModelLocation(userid, model, fileName)?.toFile()?.delete() == true
    }
}