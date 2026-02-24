import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { type EventLogRefInfo, EventLogType, getEventLog } from "@/scene/dt/eventlogs/data.ts";
import { Bolt, GitGraph, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Card } from "@/components/ui/card.tsx";
import { getDtParticipants, type ProcessParticipantInfo } from "@/scene/dt/participant/processParticipantInfo.ts";
import { EventLogComponentCard } from "@/scene/dt/eventlogs/components/EventLogComponentCard.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { CreateProcessEventLogDialog } from "@/scene/dt/eventlogs/components/CreateProcessEventLogDialog.tsx";
import { LogComponentsParticipantCardRow } from "@/scene/dt/eventlogs/components/LogComponentsParticipantCardRow.tsx";

export function LogComponentsOverview() {
  const { dtId, refId } = useParams();
  const [logs, setLogs] = useState<EventLogRefInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);
  const [participants, setParticipants] = useState<ProcessParticipantInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDtParticipants(Number(dtId));
        const logResponse = await getEventLog(Number(dtId), Number(refId));
        setParticipants(response.data);
        setLogs(logResponse.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refId, refresh]);

  function getProcessLog() {
    return logs.find(it => it.type === EventLogType.PROCESS);
  }

  return (
    <div className="m-2" key="log">
      <div className="max-width flex flex-row m-4 mb-0" key="process-h">
        <h2 className="text-lg font-semibold flex flex-row">
          <GitGraph />
          <span className="ml-2">Process Event Log</span>
          {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
        </h2>
      </div>
      <div className="flex flex-wrap" key="process-log-render">
        <div className="mr-2" key="process-format-log"></div>
        {
          getProcessLog() ?
            (<EventLogComponentCard data={getProcessLog()!} refresh={refresh} setRefresh={setRefresh} />) :
            <Dialog open={openProcess} onOpenChange={setOpenProcess}>
              <DialogTrigger asChild>
                <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
                  <Plus className="m-auto" size={40} />
                </Card>
              </DialogTrigger>
              <CreateProcessEventLogDialog setOpen={setOpenProcess} setRefresh={setRefresh} refresh={refresh} />
            </Dialog>
        }
      </div>
      <Separator className="mt-2 mb-2" />
      <div className="max-width flex flex-row m-4 mb-0" key="participant-h">
        <h2 className="text-lg font-semibold flex flex-row" key="particiapnt-f">
          <Bolt />
          <span className="ml-2">Participant Event Logs</span>
          {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
        </h2>
      </div>
      {
        participants.map(participantData =>
          <LogComponentsParticipantCardRow logs={logs} participantData={participantData} setRefresh={setRefresh} refresh={refresh} key={`row-part-${participantData.id}`}/>
        )
      }
    </div>
  );
}