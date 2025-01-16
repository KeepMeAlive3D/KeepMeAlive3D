package de.keepmealive3d.core.model

import de.keepmealive3d.adapters.model.ModelDownloadController
import java.io.File
import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.random.Random

class ModelRepository {

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
                val (modelName, fileName) = path.split(File.separator)
                ModelDownloadController.ModelInfo(
                    fileName,
                    modelName,
                )
            }
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