import { Bolt, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Card } from "@/components/ui/card.tsx";
import { CreateParticipantDialog } from "@/scene/dt/participant/CreateParticipantDialog.tsx";
import { useState } from "react";
import { EventLogCard } from "@/scene/dt/eventlogs/EventLogCard.tsx";
import type { EventLog } from "@/scene/dt/eventlogs/data.ts";

export function EventLogOverview() {
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [eventLogs, setEventLogs] = useState<EventLog[]>([{
    id: 1,
    name: "abc",
    traces: []
  }])

  return (
    <>
      <div className="max-width flex flex-row m-4 mb-0">
        <h2 className="text-lg font-semibold flex flex-row">
          <Bolt />
          <span className="ml-2">Event Logs</span>
        </h2>
      </div>
      <div className="flex flex-wrap">
        <div className="mr-2"></div>
        {
          eventLogs.map(it => {
            return (
              <EventLogCard data={it} />
            );
          })
        }
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
              <Plus className="m-auto" size={40} />
            </Card>
          </DialogTrigger>
          <CreateParticipantDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh} />
        </Dialog>
      </div>
    </>
  );
}