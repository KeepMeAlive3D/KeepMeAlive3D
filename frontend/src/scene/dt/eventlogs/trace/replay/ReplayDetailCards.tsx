import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllReplayComponents,
  type ReplayInfo,
  type ReplayLogComponent,
} from "@/scene/dt/eventlogs/trace/replay/data.ts";
import {
  ReplayStateMachineComponent,
} from "@/scene/dt/eventlogs/trace/replay/statemachine/ReplayStateMachineComponent.tsx";
import { useParams } from "react-router";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { CreateReplayComponentDialog } from "@/scene/dt/eventlogs/trace/replay/CreateReplayComponentDialog.tsx";
import { ReplayBpmComponent } from "@/scene/dt/eventlogs/trace/replay/bpm/ReplayBpmComponent.tsx";
import { EventLogType } from "@/scene/dt/eventlogs/data.ts";

export function ReplayDetailCards({ traces }: { traces: ReplayInfo[] }) {
  const [replayComponents, setComponents] = useState<ReplayLogComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { dtId, refId, traceName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllReplayComponents(Number(dtId!), Number(refId!), traceName!);
        setComponents(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refId, refresh, traceName]);


  return (
    <main className="w-full flex flex-col m-2">
      {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
      {replayComponents?.map(it => {
        switch (it.type) {
          case "statemachine":
            return <ReplayStateMachineComponent
              key={`canvas-${it.participantId}-${it.id}`}
              refresh={refresh}
              setRefresh={setRefresh}
              info={it}
              trace={traces.find(t => t.type == EventLogType.PARTICIPANT && t.typeId == it.participantId.toString())}
            />;
          case "bpm":
            return <ReplayBpmComponent info={it} setRefresh={setRefresh} refresh={refresh} />;
          default:
            return null;
        }
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="hover:bg-accent cursor-pointer min-h-80 rounded-2xl border flex justify-center align-middle">
            <Plus className="m-auto" size={40} />
          </div>
        </DialogTrigger>
        <CreateReplayComponentDialog refresh={refresh} setRefresh={setRefresh} setOpen={setOpen} />
      </Dialog>
    </main>
  );
}