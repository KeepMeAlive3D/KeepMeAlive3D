import { DigitalTwinsOverviewEmpty } from "@/scene/home/DigitalTwinsOverviewEmpty.tsx";
import type { DtProjectData } from "@/scene/home/dtProjectData.ts";
import { DigitalTwinsOverviewCard } from "@/scene/home/DigitalTwinsOverviewCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { CreateDigitalTwinProjectDialog } from "@/scene/home/CreateDigitalTwinProjectDialog.tsx";

export function DigitalTwinsOverview() {
  const data: DtProjectData[] = [
    {
      id: "1",
      name: "test",
      icon: 1
    },
    {
      id: "2",
      name: "test2",
      icon: 2
    }
  ]

  if(data.length > 0) {
    return <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="max-width flex flex-row">
        <h2 className="text-xl font-semibold">Buisness Process Digital Twins</h2>
        <div className="grow"></div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="max-w-42">Create New Digital Twin</Button>
          </DialogTrigger>
          <CreateDigitalTwinProjectDialog/>
        </Dialog>
      </div>
      {
        data.map(project => {
          return (
              <DigitalTwinsOverviewCard projectData={project}/>
          )
        })
      }
    </div>
  } else {
    return (
      <DigitalTwinsOverviewEmpty/>
    )
  }
}