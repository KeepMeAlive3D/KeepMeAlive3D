import { DigitalTwinParticipants } from "@/scene/dt/participant/DigitalTwinParticipants.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { BpInfo } from "@/scene/dt/bp/BpInfo.tsx";
import { EventLogOverview } from "@/scene/dt/eventlogs/EventLogOverview.tsx";

export function DigitalTwinOverview() {
  return (
    <div className="flex flex-col">
      <DigitalTwinParticipants />
      <Separator />
      <BpInfo />
      <Separator />
      <EventLogOverview/>
    </div>
  );
}