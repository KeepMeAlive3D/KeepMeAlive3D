import service from "@/service/service.ts";
import { DataPointEventMessage } from "@/service/wsTypes.ts";

export function getEventDataPointsOfTopic(topic: string) {
  return service.get<DataPointEventMessage[]>(
    `/api/event/mqtt/dataPoints/${topic}/limit/50`
  );
}
