import type { DtProjectData } from "@/scene/home/dtProjectData.ts";
import { FileOutput, Hammer, Star, Trash, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";

export function DigitalTwinsOverviewCard({ projectData }: { projectData: DtProjectData }) {
  return (
    <div className="bg-muted/50 aspect-video h-12 w-full rounded-lg flex flex-row items-center">
      <GetProjectIcon className="ml-4" iconId={projectData.icon} />
      <div className="ml-4 text-m flex-none">{projectData.name}</div>
      <div className="grow"></div>
      <Link to={`/dt/${projectData.id}`}>
        <Button
          type="button"
          id={`load-${projectData.id}`}
          className="col-span-1 mx-4"
          variant="outline"
        >
          Load
          <FileOutput />
        </Button>
      </Link>
      <Button
        type="button"
        id={`delete-${projectData.id}`}
        className="col-span-1 mr-4"
        variant="destructive"
      >
        <Trash />
      </Button>
    </div>
  );
}

function GetProjectIcon({ iconId, className }: { iconId: number, className: string }) {
  switch (iconId) {
    case 1:
      return (<Wrench className={className} />);
    case 2:
      return (<Star className={className} />);
    default:
      return (<Hammer className={className} />);
  }
}