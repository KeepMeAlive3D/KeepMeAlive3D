import { deleteReplayComponent, type ReplayLogComponent } from "@/scene/dt/eventlogs/trace/replay/data.ts";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import * as React from "react";
import { type SetStateAction, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";

export function ReplayStateMachineComponent({ info, refresh, setRefresh }: {
  info: ReplayLogComponent,
  setRefresh: React.Dispatch<SetStateAction<boolean>>
  refresh: boolean
}) {
  const [loading, setLoading] = useState(false);

  function removeComponent() {
    setLoading(true);
    deleteReplayComponent(info.dt, info.logId, info.trace, info.id)
      .then(() => setRefresh(!refresh))
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-80 rounded-2xl border flex justify-center align-middle mb-2 flex-row">
      sm {info.id}
      {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
      <div className="grow"></div>
      <div className="mt-2">
        <main>
          <Button
            type="button"
            className="col-span-1 my-auto mr-5 ml-auto"
            variant="destructive"
            onClick={removeComponent}
          >
            <Trash />
          </Button>
        </main>
      </div>
    </div>
  );
}