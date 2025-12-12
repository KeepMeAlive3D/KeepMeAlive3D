import service from "@/service/service.ts";

export type ProcessParticipantInfo = {
  id: string,
  name: string,
  icon: number
}

export type ProcessParticipantCreate = {
  name: string,
  icon: number
}

export function getDtParticipants(dt: number) {
  return service.get<ProcessParticipantInfo[]>(`/api/dt/${dt}/participant/`)
}

export function createParticipant(dt: number, data: ProcessParticipantCreate) {
  return service.post<ProcessParticipantInfo>(`/api/dt/${dt}/participant`, data)
}

export function deleteParticipant(dt: number, id: number) {
  return service.delete<ProcessParticipantInfo>(`/api/dt/${dt}/participant/${id}`)
}