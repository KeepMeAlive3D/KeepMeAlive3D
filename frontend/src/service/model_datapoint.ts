import service from "@/service/service.ts";
import { DataPointEventMessage } from "@/service/wsTypes.ts";

export function getEventDataPointsOfTopic(topic: string) {
  return service.get<DataPointEventMessage[]>(`/api/event/mqtt/dataPoints/${topic}/limit/50`);
}

export function getFormattedServerTime(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function getFormattedTime(unixSeconds: number): string {
  const date = new Date(unixSeconds);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}