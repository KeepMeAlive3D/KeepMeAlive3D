import type { ReplayLogComponent } from "@/scene/dt/eventlogs/trace/replay/data.ts";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export function ReplayStateMachineComponent({info}: {info: ReplayLogComponent}) {
  return(
    <div className="min-h-80 rounded-2xl border flex justify-center align-middle mb-2 flex-row">
      sm { info.id }
      <div className="grow"></div>
      <div className="mt-2">
        <main>
          <Button
            type="button"
            className="col-span-1 my-auto mr-5 ml-auto"
            variant="destructive"
          >
            <Trash />
          </Button>
        </main>
      </div>
    </div>
  )
}