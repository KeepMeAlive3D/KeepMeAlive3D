package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.adapters.data.EventLogInfo
import de.keepmealive3d.adapters.data.EventLogInfoAll
import de.keepmealive3d.adapters.data.EventLogRefInfo
import de.keepmealive3d.adapters.sql.tables.EventLogTableType
import de.keepmealive3d.core.repositories.IEventLogRepository
import de.keepmealive3d.core.services.replay.IReplayService
import dev.klenz.matthias.kscxml.parser.toList
import io.ktor.server.plugins.BadRequestException
import io.ktor.server.plugins.NotFoundException
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import javax.xml.parsers.DocumentBuilderFactory

interface IEventLogService {
    fun create(owner: Int, dt: Int, name: String): EventLogInfo
    fun save(
        owner: Int,
        dt: Int,
        eventLog: ByteArray,
        name: String,
        refId: Int,
        type: EventLogTableType,
        typeId: String
    )

    fun get(owner: Int, dt: Int, logId: Int, refId: Int): EventLogRefInfo
    fun getAll(owner: Int, dt: Int, refId: Int): List<EventLogRefInfo>
    fun getAll(owner: Int, dt: Int): List<EventLogInfoAll>
    fun delete(owner: Int, dt: Int, refId: Int)
    fun delete(owner: Int, dt: Int, refId: Int, logId: Int)
    fun setHappyPath(owner: Int, refId: Int, trace: String, isHappyPath: Boolean)
}

class EventLogService : KoinComponent, IEventLogService {
    private val repository: IEventLogRepository by inject()
    private val eventLogReplayService: IReplayService by inject()

    override fun create(owner: Int, dt: Int, name: String): EventLogInfo {
        return repository.createNewEventLog(owner, dt, name)
    }

    override fun save(
        owner: Int,
        dt: Int,
        eventLog: ByteArray,
        name: String,
        refId: Int,
        type: EventLogTableType,
        typeId: String
    ) {
        val data = convert(eventLog, name) ?: throw BadRequestException("Event log is malformatted, can't save $name")
        repository.addEventLogData(dt, name, owner, data, refId, type, typeId)
    }

    override fun get(owner: Int, dt: Int, logId: Int, refId: Int): EventLogRefInfo {
        //todo check if owner matches
        val log = repository.getEventLogData(logId) ?: throw NotFoundException("Event log is not found")
        val traces = log.eventLog.traces.filter { it.name != null }.map {
            val activeReplayEvents = eventLogReplayService.getReplay(log.owner, log.refId, it.name!!, owner).find { e->  e.type == log.type && e.typeId == log.typeId }
            activeReplayEvents?.state ?: it
        }

        log.eventLog.traces = traces
        return log
    }

    override fun getAll(owner: Int, dt: Int, refId: Int): List<EventLogRefInfo> {
        return repository.getEventLogsByRef(refId)   //todo check if owner matches
    }

    override fun getAll(owner: Int, dt: Int): List<EventLogInfoAll> {
        return repository.getAllEventLogs(dt)   //todo check if owner matches
    }

    override fun delete(owner: Int, dt: Int, refId: Int) {
        repository.deleteEventLogRef(refId) //todo check if owner matches
    }

    override fun delete(owner: Int, dt: Int, refId: Int, logId: Int) {
        repository.deleteEventLog(logId) //todo check if owner matches
    }

    override fun setHappyPath(owner: Int, refId: Int, trace: String, isHappyPath: Boolean) {
        repository.setHappyPath(refId, trace, isHappyPath)
    }

    private fun convert(fileBytes: ByteArray, name: String): EventLog? {
        val document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(fileBytes.inputStream()).also {
            it.normalize()
        }
        return document.getElementsByTagName("log").toList().map { logElement ->
            EventLog(
                name,
                traces = logElement.childNodes.toList().filter { it.nodeName == "trace" }.map { trace ->
                    EventLog.Trace(
                        name = trace
                            .childNodes
                            .toList()
                            .firstOrNull { it.attributes?.getNamedItem("key")?.nodeValue == "concept:name" }
                            ?.attributes?.getNamedItem("value")?.nodeValue,
                        events = trace.childNodes.toList().filter { it.nodeName == "event" }.map { event ->
                            EventLog.Event(
                                name = event
                                    .childNodes
                                    .toList()
                                    .firstOrNull { it.attributes?.getNamedItem("key")?.nodeValue == "concept:name" }
                                    ?.attributes
                                    ?.getNamedItem("value")
                                    ?.nodeValue,
                                datetime = event
                                    .childNodes
                                    .toList()
                                    .firstOrNull { it.attributes?.getNamedItem("key")?.nodeValue == "time:timestamp" }
                                    ?.attributes
                                    ?.getNamedItem("value")
                                    ?.nodeValue
                                    ?.let {
                                        LocalDateTime.parse(it, DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                                            .toInstant(ZoneOffset.UTC)
                                    },
                                source = event
                                    .childNodes
                                    .toList()
                                    .firstOrNull { it.attributes?.getNamedItem("key")?.nodeValue == "sensor" }
                                    ?.attributes
                                    ?.getNamedItem("value")
                                    ?.nodeValue,
                                value = event
                                    .childNodes
                                    .toList()
                                    .firstOrNull { it.attributes?.getNamedItem("key")?.nodeValue == "value" }
                                    ?.attributes
                                    ?.getNamedItem("value")
                                    ?.nodeValue
                            )
                        },
                        replayState = EventLog.ReplayState.END,
                        isHappyPath = false
                    )
                }
            )
        }.firstOrNull()
    }
}