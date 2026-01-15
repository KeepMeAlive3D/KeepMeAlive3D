import { Bolt, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useEffect, useState } from "react";
import { EventLogCard } from "@/scene/dt/eventlogs/EventLogCard.tsx";
import { type EventLogInfo, getAllEventLogs } from "@/scene/dt/eventlogs/data.ts";
import { CreateEventLogDialog } from "@/scene/dt/eventlogs/CreateEventLogDialog.tsx";
import { useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";

export function EventLogOverview() {
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true);
  const [eventLogs, setEventLogs] = useState<EventLogInfo[]>([])
  const { dtId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllEventLogs(Number(dtId));
        setEventLogs(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refresh]);


  return (
    <>
      <div className="max-width flex flex-row m-4 mb-0">
        <h2 className="text-lg font-semibold flex flex-row">
          <Bolt />
          <span className="ml-2">Event Logs</span>
          {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
        </h2>
      </div>
      <div className="flex flex-wrap">
        <div className="mr-2"></div>
        {
          eventLogs.map(it => {
            return (
              <EventLogCard data={it} refresh={refresh} setRefresh={setRefresh}/>
            );
          })
        }
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
              <Plus className="m-auto" size={40} />
            </Card>
          </DialogTrigger>
          <CreateEventLogDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh} />
        </Dialog>
      </div>
    </>
  );
}