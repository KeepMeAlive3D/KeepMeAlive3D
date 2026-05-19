import service from "@/service/service.ts";
import type { EventLogTrace, EventLogType } from "@/scene/dt/eventlogs/data.ts";

export interface ReplayLogComponent {
  id: number,
  dt: number,
  owner: number,
  logId: number,
  trace: string,
  participantId: number,
  type: string,
  additionalIdentifier: string
}

export interface CreateReplayLogComponent {
  logId: number,
  trace: string,
  participantId: number,
  type: string,
  additionalIdentifier: string
}

export interface ReplayInfo {
  dt: number,
  refId: number,
  type: EventLogType,
  typeId: string,
  state: EventLogTrace,
  activeStates: string[]
}

export function getAllReplayComponents(dtId: number, logId: number, trace: string) {
  return service.get<ReplayLogComponent[]>(`/api/dt/${dtId}/log/${logId}/trace/${trace}/replayComponent`);
}

export function createReplayComponent(dtId: number, data: CreateReplayLogComponent) {
  return service.post(`/api/dt/${dtId}/log/${data.logId}/trace/${data.trace}/replayComponent`, data);
}

export function deleteReplayComponent(dtId: number, logId: number, trace: string, id: number) {
  return service.delete(`/api/dt/${dtId}/log/${logId}/trace/${trace}/replayComponent/${id}`);
}

export function getReplayState(dtId: number, refId: number, trace: string) {
  return service.get<ReplayInfo[]>(`/api/dt/${dtId}/log/${refId}/trace/${trace}`);
}