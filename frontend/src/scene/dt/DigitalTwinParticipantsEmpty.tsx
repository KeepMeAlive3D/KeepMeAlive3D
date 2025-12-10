import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { FolderCog } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CreateParticipantDialog } from "@/scene/dt/CreateParticipantDialog.tsx";

export function DigitalTwinParticipantsEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCog />
        </EmptyMedia>
        <EmptyTitle>No Process Participants Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any process participants yet. Get started by creating
          your first process participant.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Process Participant</Button>
          </DialogTrigger>
          <CreateParticipantDialog/>
        </Dialog>
      </EmptyContent>
    </Empty>
  )
}