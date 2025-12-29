import type {AxiosResponse} from "axios";
import service from "@/service/service.ts";
import type { StateMachine } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";

export type AtomicStateData = {
  id: string
  posX: number
  posY: number
  connectedTo: string[],
  details: StateInfoDetails
}

export type StateInfoDetails = {
  initial: string | undefined,
  onEntry: boolean,
  onExit: boolean,
  transitions: StateTransitionsDetails[]
}

export type StateTransitionsDetails = {
  toState: string | undefined,
  event: string | undefined,
  condition: string | undefined
}

export type StateChartInfo = {
  id: number,
  name: string
}

export function getStateMachineForDT(dtId: string, participantId: string, id: number): Promise<AxiosResponse<StateMachine>> {
  return service.get<StateMachine>(`/api/dt/${dtId}/participant/${participantId}/statemachine/${id}`);
}

export function uploadStateMachine(dtId: string, participantId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return service.post(`/api/dt/${dtId}/participant/${participantId}/statemachine`, formData);
}

export function getAllStateMachines(dtId: string, participantId: string) {
  return service.get<StateChartInfo[]>(`/api/dt/${dtId}/participant/${participantId}/statemachine`);
}

export function deleteStateMachine(dtId: string, participantId: string, id: number) {
  return service.delete(`/api/dt/${dtId}/participant/${participantId}/statemachine/${id}`);
}