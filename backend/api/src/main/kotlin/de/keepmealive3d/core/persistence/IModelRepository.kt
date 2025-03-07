package de.keepmealive3d.core.persistence

import de.keepmealive3d.adapters.data.FileModelInfo
import java.nio.file.Path

interface IModelRepository {
    fun createUniqueFileLocation(userid: Int, path: String, name: String): Path

    fun getModelLocation(userid: Int, model: String, fileName: String): Path?

    fun getAllModelFileNames(userid: Int): Set<FileModelInfo>

    fun deleteFile(userid: Int, model: String, fileName: String): Boolean
}