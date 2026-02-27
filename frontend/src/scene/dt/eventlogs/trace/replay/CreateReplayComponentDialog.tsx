import * as React from "react";
import { type SetStateAction, useEffect, useState } from "react";
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
import { File, FileCog } from "lucide-react";
import { getDtParticipants, type ProcessParticipantInfo } from "@/scene/dt/participant/processParticipantInfo.ts";
import { GetParticipantIcon } from "@/scene/dt/participant/ParticipantIcon.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { getAllStateMachines, type StateChartInfo } from "@/scene/dt/participant/stateMachine/data.ts";
import { type BpInfoData, getBpmFiles } from "@/scene/dt/bp/bpInfoData.ts";

export function CreateReplayComponentDialog({ setOpen, setRefresh, refresh }: {
  setOpen: React.Dispatch<SetStateAction<boolean>>
  setRefresh: React.Dispatch<SetStateAction<boolean>>
  refresh: boolean
}) {
  const [loading, setLoading] = useState(false);
  const { dtId, refId, traceName } = useParams();

  const [participants, setParticipants] = useState<ProcessParticipantInfo[]>([]);
  const [bpmFile, setBpmFile] = useState<BpInfoData | undefined>(undefined);
  const [stateMachines, setStateMachines] = useState<Map<string, StateChartInfo[]>>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        getDtParticipants(Number(dtId))
          .then(it => {
            setParticipants(it.data);
            it.data.forEach(participant => {
              getAllStateMachines(dtId!, participant.id).then(requestSm => {
                setStateMachines(prevState => {
                  const newMap = new Map(prevState);
                  newMap.set(participant.id, requestSm.data);
                  return newMap;
                });
              });
            });
          })
          .finally(() => {
            setLoading(false);
          });

        getBpmFiles(Number(dtId)).then(it => {
          if(it.data.length > 0) {
            setBpmFile(it.data[0])
          }
        })
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refId, traceName]);


  function handleSubmit(participantId: number, type: string, additionalIdentifier: string) {
    setLoading(true);
    createReplayComponent(Number(dtId!), {
      logId: Number(refId!),
      trace: traceName!,
      participantId: participantId,
      type: type,
      additionalIdentifier: additionalIdentifier,
    }).then().finally(() => {
      setLoading(false);
      setOpen(false);
      setRefresh(!refresh);
    });
  }

  return (<DialogContent className="3xl overflow-auto">
    <DialogHeader>
      <DialogTitle>Select a component to display {loading ?
        <Spinner className="ml-2 my-auto size-5" /> : null}</DialogTitle>
      <DialogDescription>
        Select a component that is updated alongside the replay.
      </DialogDescription>
    </DialogHeader>
    {bpmFile ? (<>
      <h2>Process Model</h2>
      <div className="border rounded-xl hover:bg-accent cursor-pointer flex flex-row min-h-16"
           onClick={() => handleSubmit(-1, "bpm", bpmFile?.id + "")}>
        <File className="m-auto ml-5" />
        <h2 className="m-auto font-medium">{bpmFile.fileName}</h2>
        <div className="m-auto"></div>
      </div>
    </>) : null}

    <h2>Participants</h2>
    {participants.map(partId =>
      <>
        <Separator />
        <h3 className="flex font-bold"><GetParticipantIcon className="mr-2" iconId={partId.icon}
                                                           size={20} /> {partId.name}</h3>
        <h4>State Machines</h4>
        <div className="grid grid-cols-2 gap-2">
          {stateMachines?.get(partId.id)?.map(sm =>
            <div className="border rounded-xl hover:bg-accent cursor-pointer flex flex-row min-h-16"
                 onClick={() => handleSubmit(Number(partId.id), "statemachine", sm.id + "")}>
              <FileCog className="m-auto ml-5" />
              <h2 className="m-auto font-medium">{sm.name}</h2>
              <div className="m-auto"></div>
            </div>,
          )}
        </div>
      </>,
    )}
    <DialogFooter className="mt-2">
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>);
}