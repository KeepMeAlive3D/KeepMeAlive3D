package de.keepmealive3d.core.services

import de.keepmealive3d.adapters.data.EventLog
import de.keepmealive3d.adapters.data.EventLogInfo
import de.keepmealive3d.core.repositories.IEventLogRepository
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
    fun save(owner: Int, dt: Int, eventLog: ByteArray, name: String)
    fun get(owner: Int, dt: Int, id: Int): EventLogInfo
    fun getAll(owner: Int, dt: Int): List<EventLogInfo>
    fun delete(owner: Int, dt: Int, id: Int)
}

class EventLogService : KoinComponent, IEventLogService {
    private val repository: IEventLogRepository by inject()
    private val eventLogReplayService: IEventLogReplayService by inject()

    override fun save(owner: Int, dt: Int, eventLog: ByteArray, name: String) {
        val data = convert(eventLog, name) ?: throw BadRequestException("Event log is malformatted, can't save $name")
        repository.addEventLog(dt, name, owner, data)
    }

    override fun get(owner: Int, dt: Int, id: Int): EventLogInfo {
        //todo check if owner matches
        val log = repository.getEventLog(id) ?: throw NotFoundException("Event log is not found")
        val traces = log.eventLog.traces.filter { it.name != null }.map {
            val activeReplayEvents = eventLogReplayService.getWithState(log.owner, log.dt, log.id, it.name!!)
            if(activeReplayEvents.isNotEmpty()) {
                EventLog.Trace(
                    it.name,
                    activeReplayEvents,
                    eventLogReplayService.getReplayState(log.owner, log.dt, log.id, it.name)
                )
            } else {
                it
            }
        }

        log.eventLog.traces = traces
        return log
    }

    override fun getAll(owner: Int, dt: Int): List<EventLogInfo> {
        return repository.getAllEventLogs(dt)   //todo check if owner matches
    }

    override fun delete(owner: Int, dt: Int, id: Int) {
        repository.deleteEventLog(id) //todo check if owner matches
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
                        replayState = EventLog.ReplayState.END
                    )
                }
            )
        }.firstOrNull()
    }
}