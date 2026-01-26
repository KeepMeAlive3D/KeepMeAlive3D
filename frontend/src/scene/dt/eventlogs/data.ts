import service from "@/service/service.ts";

export interface EventLogInfo {
  id: number;
  owner: number;
  dt: number;
  eventLog: EventLog
}

export interface EventLog {
  name: string;
  traces: EventLogTrace[];
}

export interface EventLogTrace {
  name: string;
  events: EventLogEvent[];
  replayState: ReplayState;
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
  ACTIVE= "ACTIVE",
  EXECUTED = "EXECUTED",
  NOT_EXECUTED = "NOT_EXECUTED"
}

export function getAllEventLogs(dt: number) {
  return service.get<EventLogInfo[]>(`/api/dt/${dt}/log`)
}

export function getEventLog(dt: number, id: number) {
  return service.get<EventLogInfo>(`/api/dt/${dt}/log/${id}`)
}

export function uploadEventLog(dtId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return service.post(`/api/dt/${dtId}/log`, formData)
}

export function deleteEventLog(dtId: number, id: number) {
  return service.delete(`/api/dt/${dtId}/log/${id}`)
}