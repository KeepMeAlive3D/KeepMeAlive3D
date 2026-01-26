import * as React from "react";
import { type SetStateAction, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useParams } from "react-router";
import { createReplayComponent } from "@/scene/dt/eventlogs/trace/replay/data.ts";

export function CreateReplayComponentDialog({ setOpen, setRefresh, refresh }: {
  setOpen: React.Dispatch<SetStateAction<boolean>>
  setRefresh: React.Dispatch<SetStateAction<boolean>>
  refresh: boolean
}) {
  const [loading, setLoading] = useState(false);
  const { dtId, logId, traceName } = useParams();

  function handleSubmit() {
    setLoading(true)
    createReplayComponent(Number(dtId!), {
      logId: Number(logId!),
      trace: traceName!,
      participantId: 1,
      type: "statemachine",
      additionalIdentifier: "abc.xml"
    }).then().finally(() => {
      setLoading(false)
      setOpen(false)
      setRefresh(!refresh)
    })
  }

  return (<DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Upload a Event log</DialogTitle>
      <DialogDescription>
        Upload a event log in the .xes format.
      </DialogDescription>
    </DialogHeader>
    <Button type="submit" disabled={loading} onClick={handleSubmit}>
      {loading ? <Spinner className="ml-2"/> : <span>Do</span>}
    </Button>
    <DialogFooter className="mt-2">
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>);
}