import { useParams } from "react-router";

export function DigitalTwinParticipant() {
  const { dtId, participantId } = useParams();
  return (
    <>Participant {participantId} of dt {dtId}</>
  )
}