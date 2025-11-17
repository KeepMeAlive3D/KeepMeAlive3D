import type { ParticipantData } from "@/scene/dt/participantData.ts";
import { DigitalTwinParticipantsEmpty } from "@/scene/dt/DigitalTwinParticipantsEmpty.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DigitalTwinParticipantCard } from "@/scene/dt/DigitalTwinParticipantCard.tsx";
import { CreateParticipantDialog } from "@/scene/dt/CreateParticipantDialog.tsx";

export function DigitalTwinParticipants() {
  const sampleData: ParticipantData[] = [
    {
      id: "1",
      icon: 1,
      name: "machineA",
      stateMachine: "calculator.xml",
      model: "turm.glb"
    },
    {
      id: "2",
      name: "machineB",
      icon: 2,
      stateMachine: "coffee.xml",
      model: "turm2.glb"
    }
  ]

  if(sampleData.length > 0) {
    return <div className="flex flex-1 flex-col gap-4 p-4">
      {
        sampleData.map(it => {
          return (
            <DigitalTwinParticipantCard data={it}/>
          )
        })
      }
      <div className="max-width flex flex-row">
        <div className="grow"></div>
        <Dialog>
          <DialogTrigger>
            <Button className="max-w-60">Create New Process Participant</Button>
          </DialogTrigger>
          <CreateParticipantDialog/>
        </Dialog>
      </div>
    </div>
  } else {
    return (
      <DigitalTwinParticipantsEmpty/>
    )
  }
}