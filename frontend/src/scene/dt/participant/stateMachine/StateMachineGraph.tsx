import { useEffect, useState } from "react";
import {getStateMachineForDT, type AtomicStateData} from "./data.ts";
import { Circle, Arrow } from "react-konva";
import Konva from "konva";
import {useParams} from "react-router";

export function StateMachineGraph({ setLoading, setInspectState, inspectState }: {
  setLoading: (value: boolean) => void,
  setInspectState: (value: AtomicStateData) => void,
  inspectState: AtomicStateData | undefined
}) {
  const [states, setStates] = useState<AtomicStateData[]>([]);
  const { dtId, participantId, statemachineName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getStateMachineForDT(dtId!, participantId!, statemachineName!);
        setStates(response.data);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData().then();
  }, [dtId, participantId, setLoading, statemachineName]);
  
  const getConnectorPoints = (from: AtomicStateData, to: AtomicStateData) => {
    const dx = to.posX - from.posX;
    const dy = to.posY - from.posY;
    const angle = Math.atan2(-dy, dx);

    const radius = 30;

    return [
      from.posX + -radius * Math.cos(angle + Math.PI),
      from.posY + radius * Math.sin(angle + Math.PI),
      to.posX + -radius * Math.cos(angle),
      to.posY + radius * Math.sin(angle),
    ];
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.target.x(Math.round(e.target.x() / 25) * 25);
    e.target.y(Math.round(e.target.y() / 25) * 25);

    setStates(
      states.map((state) =>
        "node" + state.id === e.target.id()
          ? { ...state, posX: e.target.x(), posY: e.target.y() }
          : state,
      ),
    );
  };

  const handleOnClickState = (_e: Konva.KonvaEventObject<MouseEvent>, state: AtomicStateData) => {
    setInspectState(state);
  };

  const getInitialState = (state: AtomicStateData) => {
    return states.find(it => it.id === state.details.initial);
  };

  return (
    <>
      {
        states.map((state) => {
          return (
            <>
              <Circle
                key={"node" + state.id}
                id={"node" + state.id}
                x={state.posX}
                y={state.posY}
                draggable
                stroke="#737373FF"
                fill="#171717FF"
                onDragMove={handleDragMove}
                onClick={it => handleOnClickState(it, state)}
                radius={30}
                shadowBlur={10}
                shadowOpacity={(inspectState?.id !== undefined && inspectState.id === state.id) ? 0.5 : 0}
                shadowColor="#22c55e"
              />
              {
                state.connectedTo.map(toStateId => {
                  const toState = states.find(it => it.id === toStateId);
                  if (toState === undefined) return null;
                  return (
                    <Arrow
                      key={`arrow${state.id}-${toStateId}`}
                      id={`arrow${state.id}-${toStateId}`}
                      points={getConnectorPoints(state, toState)}
                      fill="white"
                      stroke="white"
                    />
                  );
                })
              }
              {
                getInitialState(state) !== undefined ?
                  <Arrow
                    key={`arrow${state.id}-initial`}
                    id={`arrow${state.id}-initial`}
                    points={getConnectorPoints(state, getInitialState(state)!)}
                    fill="red"
                    stroke="red"
                  />
                  : null
              }
            </>
          );
        })
      }
    </>
  );
}