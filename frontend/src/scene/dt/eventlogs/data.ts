import service from "@/service/service.ts";
import type { TraceTransitionAnalyzeData } from "@/scene/dt/eventlogs/trace/analyze/data.ts";

export interface EventLogInfoAll {
  id: number;
  name: string;
  owner: number;
  dt: number;
  refs: EventLogRefInfo[];
}

export interface EventLogRefInfo {
  id: number;
  owner: number;
  refId: number;
  dt: number;
  eventLog: EventLog;
  type: EventLogType;
  typeId: string;
}

export enum EventLogType {
  PARTICIPANT = "PARTICIPANT",
  PROCESS = "PROCESS"
}

export interface EventLogInfo {
  id: number;
  owner: number;
  dt: number;
  eventLog: EventLog;
}

export interface EventLog {
  name: string;
  traces: EventLogTrace[];
}

export interface EventLogTrace {
  name: string;
  events: EventLogEvent[];
  replayState: ReplayState;
  isHappyPath: boolean;
}

export enum ReplayState {
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  END = "END"
}


export interface EventLogEvent {
  name: string,
  datetime: number | undefined,
  source: string | undefined,
  value: string | undefined,
  replayState: EventReplayState
}

export enum EventReplayState {
  ACTIVE = "ACTIVE",
  EXECUTED = "EXECUTED",
  NOT_EXECUTED = "NOT_EXECUTED"
}

export interface EventLogAnalyzed {
  participantId: string;
  data: EventLogAnalyzedParticipant[];
}

export interface EventLogAnalyzedParticipant {
  trace: EventLogTrace,
  data: TraceTransitionAnalyzeData[]
}

export function getEventLog(dt: number, refId: number) {
  return service.get<EventLogRefInfo[]>(`/api/dt/${dt}/log/${refId}`);
}

export function getSpecificEventLog(dt: number, refId: number, logId: number) {
  return service.get<EventLogRefInfo>(`/api/dt/${dt}/log/${refId}/id/${logId}`);
}


export function getAllEventLogs(dt: number) {
  return service.get<EventLogInfoAll[]>(`/api/dt/${dt}/log`);
}

export function createEventLog(dt: number, name: string) {
  return service.post(`/api/dt/${dt}/log`, {
    name: name,
  });
}

export function uploadParticipantEventLog(dtId: number, refId: number, pId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return service.post(`/api/dt/${dtId}/log/${refId}/uploadParticipantLog/${pId}`, formData);
}

export function uploadProcessEventLog(dtId: number, refId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return service.post(`/api/dt/${dtId}/log/${refId}/uploadProcessLog`, formData);
}

export function deleteEventLog(dtId: number, refId: number) {
  return service.delete(`/api/dt/${dtId}/log/${refId}`);
}

export function deleteEventLogComp(dtId: number, refId: number, logId: number) {
  return service.delete(`/api/dt/${dtId}/log/${refId}/id/${logId}`);
}

export function setHappyPath(dt: number, refId: number, trace: string, happyPath: boolean) {
  return service.put(`/api/dt/${dt}/log/${refId}/setHappyPath`, {
    traceId: trace,
    isHappyPath: happyPath,
  });
}

export function replayEventLog(dt: number, refId: number) {
  return service.put(`/api/dt/${dt}/log/${refId}/replay`);
}

export function analyzeEventLog(dt: number, refId: number) {
  return service.get<EventLogAnalyzed[]>(`/api/dt/${dt}/log/${refId}/analyze`);
}

export function analyzeDataToCsv(data: EventLogAnalyzed) {
  const entries = data.data.flatMap(part =>
    part.data.map(log =>
      part.trace.name + "," + log.correlationEvent + "," + log.executionDuration + ",0," + log.isErrorState + "," + log.errorDetectedCycle + ",0\n"
    )
  )

  let csv = "trace,eventName,date,value,isError,isCycle,cycleIteration\n"
  entries.forEach(entry => {
    csv += entry;
  })

  return csv;
}

export function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}