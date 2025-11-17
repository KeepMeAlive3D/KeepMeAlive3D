import { Button } from "@/components/ui/button.tsx";
import { FileOutput, Hammer, PersonStanding, Trash, TruckElectric } from "lucide-react";
import type { ParticipantData } from "@/scene/dt/participantData.ts";
import { Link, useParams } from "react-router";

export function DigitalTwinParticipantCard({ data }: { data: ParticipantData }) {
  const { dtId } = useParams();

  return (
    <div className="bg-muted/50 aspect-video h-12 w-full rounded-lg flex flex-row items-center">
      <GetParticipantIcon className="ml-4" iconId={data.icon} />
      <div className="ml-4 text-m flex-none">{data.name}</div>
      <div className="grow"></div>
      <Link to={`/dt/${dtId}/participant/${data.id}`}>
        <Button
          type="button"
          id={`load-${data.id}`}
          className="col-span-1 mx-4"
          variant="outline"
        >
          Load
          <FileOutput />
        </Button>
      </Link>
      <Button
        type="button"
        id={`delete-${data.id}`}
        className="col-span-1 mr-4"
        variant="destructive"
      >
        <Trash />
      </Button>
    </div>
  );
}

function GetParticipantIcon({ iconId, className }: { iconId: number, className: string }) {
  switch (iconId) {
    case 1:
      return (<PersonStanding className={className} />);
    case 2:
      return (<TruckElectric className={className} />);
    default:
      return (<Hammer className={className} />);
  }
}