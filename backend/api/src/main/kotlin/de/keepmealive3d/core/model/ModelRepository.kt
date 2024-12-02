package de.keepmealive3d.core.model

import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.createDirectories
import kotlin.io.path.exists
import kotlin.random.Random

class ModelRepository {

    /**
     * reruns a path to a valid location to save a model to
     */
    fun saveFile(userid: Int, name: String): Path {
        val userModelPath = Path(System.getProperty("user.dir")).resolve("models").resolve(userid.toString())
        userModelPath.createDirectories()
        val filePath = if(userModelPath.resolve(name).exists()) {
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
    fun getModel(userid: Int, fileName: String): Path? {
        val userModelPath = Path(System.getProperty("user.dir")).resolve("models").resolve(userid.toString())
        if(userModelPath.resolve(fileName).exists()) {
            return userModelPath.resolve(fileName)
        }
        return null
    }

    /**
     * @return all uploaded files by a user
     */
    fun getAllFileNames(userid: Int): Set<String> {
        val userModelPath = Path(System.getProperty("user.dir")).resolve("models").resolve(userid.toString())
        return userModelPath
            .toFile()
            .walk()
            .maxDepth(1)
            .filterNot { file -> file.name == userid.toString() }
            .map { file -> file.name }
            .toSet()
    }

    /**
     * deletes a file for a user
     * @return true if the file was deleted, false if no file was found or there where fs problems
     */
    fun deleteFile(userid: Int, fileName: String): Boolean {
        return getModel(userid, fileName)?.toFile()?.delete() == true
    }
}