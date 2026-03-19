import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { getAllStateMachines, type StateChartInfo } from "@/scene/dt/participant/stateMachine/data.ts";
import { useParams } from "react-router";
import { StateMachineAnalyzeCard } from "@/scene/dt/eventlogs/trace/analyze/StateMachineAnalyzeCard.tsx";
import { getDtParticipants, type ProcessParticipantInfo } from "@/scene/dt/participant/processParticipantInfo.ts";
import { GetParticipantIcon } from "@/scene/dt/participant/ParticipantIcon.tsx";
import { Separator } from "@/components/ui/separator.tsx";

interface SmInfo {
  ptInfo: ProcessParticipantInfo,
  stateChars: StateChartInfo[]
}

export function AnalyzeStateMachinesOverview() {
  const [loading, setLoading] = useState(false);
  const [stateMachines, setStateMachines] = useState<SmInfo[]>([]);
  const { dtId } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const participants = await getDtParticipants(Number(dtId));
        const data = participants.data.map(async participant => {
          const smInfo = await getAllStateMachines(dtId!, participant.id);
          return {
            ptInfo: participant,
            stateChars: smInfo.data,
          } as SmInfo;
        });
        const result = await Promise.all(data);
        setStateMachines(result);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId]);

  return (
    <div className="flex flex-col">
      <div className="max-width flex flex-row m-4">
        <h2 className="text-xl font-semibold">State Machines</h2>
        {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
      </div>

      {
        stateMachines.map(it => {
          return (
            <div>
              <Separator/>
              <div className="m-4">
                <h3 className="text-xl font-semibold flex-row flex items-center"><GetParticipantIcon
                  iconId={it.ptInfo.icon} className="mr-5" size={45} /> {it.ptInfo.name}</h3>
                <div className="flex flex-wrap">
                  <div className="mr-2">
                    {it.stateChars.map(sc =>
                      <StateMachineAnalyzeCard name={sc.name} id={sc.id} />,
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }

    </div>
  );
}