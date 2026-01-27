import { Hammer, PersonStanding, TruckElectric } from "lucide-react";

export function GetParticipantIcon({iconId, className, size}: { iconId: number, className: string, size: number }) {
  switch (iconId) {
    case 1:
      return (<PersonStanding className={className} size={size}/>);
    case 2:
      return (<TruckElectric className={className} size={size}/>);
    default:
      return (<Hammer className={className} size={size}/>);
  }
}