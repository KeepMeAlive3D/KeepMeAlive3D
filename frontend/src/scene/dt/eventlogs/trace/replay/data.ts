import service from "@/service/service.ts";

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

export function getAllReplayComponents(dtId: number, logId: number, trace: string) {
  return service.get<ReplayLogComponent[]>(`/api/dt/${dtId}/log/${logId}/trace/${trace}/replayComponent`);
}

export function createReplayComponent(dtId: number, data: CreateReplayLogComponent) {
  return service.post(`/api/dt/${dtId}/log/${data.logId}/trace/${data.trace}/replayComponent`, data);
}

export function deleteReplayComponent(dtId: number, logId: number, trace: string, id: number) {
  return service.delete(`/api/dt/${dtId}/log/${logId}/trace/${trace}/replayComponent/${id}`);
}