import type {AxiosResponse} from "axios";
import service from "@/service/service.ts";

export interface StateData {
  id: string
  posX: number
  posY: number
  connectedTo: string[],
  details: StateInfoDetails
}

export interface StateInfoDetails {
  initial: string | undefined,
  onEntry: boolean,
  onExit: boolean,
  transitions: StateTransitionsDetails[]
}

export interface StateTransitionsDetails {
  toState: string | undefined,
  event: string | undefined,
  condition: string | undefined
}

export function getStateMachineForDT(dtId: string, participantId: string, fileName: string): Promise<AxiosResponse<StateData[]>> {
  return service.get<StateData[]>(`/api/dt/${dtId}/participant/${participantId}/statemachine/${fileName}`);
}

export function uploadStateMachine(dtId: string, participantId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return service.post(`/api/dt/${dtId}/participant/${participantId}/statemachine`, formData);
}

export function getAllStateMachines(dtId: string, participantId: string) {
  return service.get<string[]>(`/api/dt/${dtId}/participant/${participantId}/statemachine`);
}

export function deleteStateMachine(dtId: string, participantId: string, fileName: string) {
  return service.delete(`/api/dt/${dtId}/participant/${participantId}/statemachine/${fileName}`);
}