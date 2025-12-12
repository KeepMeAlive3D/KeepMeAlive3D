import service from "@/service/service.ts";

export type DigitalTwinInfo = {
  id: number,
  icon: number,
  name: string
}

export type DigitalTwinCreate = {
  name: string,
  icon: number
}

export function getDigitalTwins() {
  return service.get<DigitalTwinInfo[]>(`/api/dt`)
}

export function createDigitalTwin(data: DigitalTwinCreate) {
  return service.post<DigitalTwinInfo>(`/api/dt`, data)
}

export function deleteDigitalTwin(id: number) {
  return service.delete<DigitalTwinInfo>(`/api/dt/${id}`)
}