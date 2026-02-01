import { deleteReplayComponent, type ReplayLogComponent } from "@/scene/dt/eventlogs/trace/replay/data.ts";
import * as React from "react";
import { type SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";

export function ReplayBpmComponent({ info, refresh, setRefresh }: {
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
    <div className="min-h-80 rounded-2xl border flex justify-end align-middle mb-2 flex-row">
      {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
      {info.type}
      <div className="absolute z-20">
        <Button
          type="button"
          className="col-span-1 my-auto mr-3 mt-3 ml-auto cursor-pointer"
          variant="destructive"
          onClick={removeComponent}
        >
          <Trash />
        </Button>
      </div>
    </div>
  )
}