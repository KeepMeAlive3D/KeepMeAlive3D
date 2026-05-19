import {Separator} from "@/components/ui/separator.tsx";
import {StateMachineOverview} from "@/scene/dt/participant/stateMachine/StateMachineOverview.tsx";
import {ModelOverview} from "@/scene/dt/participant/model/ModelOverview.tsx";

export function DigitalTwinParticipant() {
  return (
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold m-4">Process Participant <span className="ml-2 ext-blue-600 dark:text-sky-400">test</span></h2>
        <Separator/>
        <StateMachineOverview/>
        <Separator/>
        <ModelOverview/>
      </div>
  )
}