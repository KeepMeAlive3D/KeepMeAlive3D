import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { type StateData } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import { RenderState } from "@/scene/dt/participant/stateMachine/canvas/RenderState.tsx";
import { DrawArrows } from "@/scene/dt/participant/stateMachine/canvas/DrawArrows.tsx";
import { useParams } from "react-router";
import { getStateMachineForDT } from "@/scene/dt/participant/stateMachine/data.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useDispatch } from "react-redux";
import { updateStateMachine } from "@/redux/slices/StateMachineSlice.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import { StateInspectionPopover } from "@/scene/dt/participant/stateMachine/canvas/StateInspectionPopover.tsx";

export function StateMachineCanvas({ pDtId, pParticipantId, pScId, activeStates }: {
  pDtId: string | undefined,
  pParticipantId: string | undefined,
  pScId: number | undefined,
  activeStates: string[]
}) {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { dtId, participantId, scId } = useParams();

  const sDtId = Number(pDtId ?? dtId)
  const sParticipantId = Number(pParticipantId ?? participantId)
  const sScId = Number(pScId ?? scId)

  const instanceId = `${sDtId}-${sParticipantId}-${sScId}`;
  const sm = useAppSelector((state) => state.sm.instances[instanceId]);
  const [inspectState, setInspectState] = useState<StateData | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getStateMachineForDT(sDtId.toString(), sParticipantId.toString(), sScId);
        dispatch(updateStateMachine({
          ...response.data,
          dtId: Number(sDtId),
          pId: Number(sParticipantId),
          id: Number(sScId)
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData().then();
  }, [dtId, setLoading, scId, dispatch, sScId, sParticipantId, sDtId]);

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
        setDimensions({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={divRef} key={`ref-${sParticipantId}-${pScId}`}
         className="relative flex-1 h-full overflow-hidden bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
      {
        loading ? <Spinner /> : <Stage width={dimensions.width} height={dimensions.height} className="w-full"
                                       key={`stage-${sParticipantId}-${pScId}`}>
          <Layer key={`layer-${sParticipantId}-${pScId}`}>
            {
              sm.states.map(it => <RenderState renderStateId={it.id} setInspectState={setInspectState}
                                               activeStates={activeStates}
                                               participantId={sParticipantId}
                                               dtId={sDtId}
                                               scId={sScId}
                                               key={`render-state-${sParticipantId}-${sScId}-${it.id}`} />)
            }
            <DrawArrows participantId={sParticipantId} dtId={sDtId} scId={sScId}/>
          </Layer>
        </Stage>
      }
      <StateInspectionPopover inspectState={inspectState} setInspectState={setInspectState} />
    </div>
  );
}