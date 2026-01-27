import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { type StateData, type StateMachine } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import { RenderState } from "@/scene/dt/participant/stateMachine/canvas/RenderState.tsx";
import { DrawArrows } from "@/scene/dt/participant/stateMachine/canvas/DrawArrows.tsx";
import { useParams } from "react-router";
import { getStateMachineForDT } from "@/scene/dt/participant/stateMachine/data.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useDispatch } from "react-redux";
import { updateStateMachine } from "@/redux/slices/StateMachineSlice.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import { StateInspectionPopover } from "@/scene/dt/participant/stateMachine/canvas/StateInspectionPopover.tsx";

export function StateMachineCanvas({ pDtId, pParticipantId, pScId }: {
  pDtId: string | undefined,
  pParticipantId: string | undefined,
  pScId: number | undefined
}) {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const sm: StateMachine = useAppSelector((state) => state.sm);
  const [inspectState, setInspectState] = useState<StateData | undefined>(undefined);

  const { dtId, participantId, scId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getStateMachineForDT(pDtId ?? dtId!, pParticipantId ?? participantId!, pScId ?? Number(scId));
        dispatch(updateStateMachine(response.data));
        //dispatch(updateStateMachine(sampleStateData));
        console.debug(`sm`, response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then();
  }, [dtId, participantId, setLoading, scId, dispatch, pDtId, pParticipantId, pScId]);

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
    <div ref={divRef}
         className="relative flex-1 h-full overflow-hidden bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
      {
        loading ? <Spinner /> : <Stage width={dimensions.width} height={dimensions.height} className="w-full">
          <Layer>
            {
              sm.states.map(it => <RenderState renderStateId={it.id} setInspectState={setInspectState} />)
            }
            <DrawArrows />
          </Layer>
        </Stage>
      }
      <StateInspectionPopover inspectState={inspectState} setInspectState={setInspectState} />
    </div>
  );
}