import { type SetStateAction, useState } from "react";
import { GetParticipantIcon } from "@/scene/dt/participant/ParticipantIcon.tsx";
import { type EventLogRefInfo, EventLogType } from "@/scene/dt/eventlogs/data.ts";
import { EventLogComponentCard } from "@/scene/dt/eventlogs/components/EventLogComponentCard.tsx";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Card } from "@/components/ui/card.tsx";
import { Plus } from "lucide-react";
import { Separator } from "@radix-ui/react-menubar";
import { CreateEventLogDialog } from "@/scene/dt/eventlogs/components/CreateEventLogDialog.tsx";
import * as React from "react";
import type { ProcessParticipantInfo } from "@/scene/dt/participant/processParticipantInfo.ts";

export function LogComponentsParticipantCardRow({ participantData, refresh, setRefresh, logs }: {
  participantData: ProcessParticipantInfo,
  setRefresh: React.Dispatch<SetStateAction<boolean>>
  refresh: boolean,
  logs: EventLogRefInfo[]
}) {
  const [open, setOpen] = useState(false);
  return (
    <div key={"row-p-" + participantData.id}>
      <Separator className="mt-2 mb-2" />
      <h3 className="text-lg font-semibold flex flex-row text-center"><GetParticipantIcon
        iconId={participantData.icon} className="ml-5"
        size={45} />{participantData.name}{participantData.id}</h3>
      <div className="flex flex-wrap" key={"part-row-" + participantData.id}>
        <div className="mr-2" key={"part-row-f" + participantData.id}></div>
        {
          logs.filter(l => l.type === EventLogType.PARTICIPANT && l.typeId === participantData.id.toString()).map(l => {
            return (
              <EventLogComponentCard data={l} refresh={refresh} setRefresh={setRefresh} key={"log-card-" + l.id} />
            );
          })
        }
        <Dialog open={open} onOpenChange={setOpen} key={"dialog-part-" + participantData.id}>
          <DialogTrigger asChild key={"dialog-part-child-" + participantData.id}>
            <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
              <Plus className="m-auto" size={40} />
            </Card>
          </DialogTrigger>
          <CreateEventLogDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh}
                                pId={Number(participantData.id)} key={"dialog-part-popup-" + participantData.id} />
        </Dialog>
      </div>
    </div>);
}