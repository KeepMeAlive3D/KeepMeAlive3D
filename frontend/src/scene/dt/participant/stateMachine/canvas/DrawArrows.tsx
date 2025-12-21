import type { StateData, StateMachine } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import { findState } from "@/scene/dt/participant/stateMachine/canvas/scUtil.ts";
import { Arrow } from "react-konva";

export function DrawArrows({ stateMachine }: { stateMachine: StateMachine }) {
  const getConnectorPoints = (from: StateData, to: StateData) => {
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

  function getConnections(states: StateData[]) {
    const cooState = new Set<StateData[]>();
    states.forEach(it => {
      getAllConnections(it, cooState);
    });
    return Array.from(cooState);
  }

  function getAllConnections(state: StateData, connections: Set<StateData[]>) {
    state.connectedTo.forEach(it => {
      const to = findState(stateMachine.states, it);
      if (to) {
        connections.add([state, to]);
      }
    });
    state.childStates.forEach(it => {
      getAllConnections(it, connections);
    });
    return connections;
  }

  return (
    <>
      {
        Array.from(getConnections(stateMachine.states).map(it => {
          console.debug(`draw arrow`, it);
          return (
            <Arrow
              key={`arrow${it[0].id}-${it[1].id}`}
              id={`arrow${it[0].id}-${it[1].id}`}
              points={getConnectorPoints(it[0], it[1])}
              fill="white"
              stroke="white"
            />
          );
        }))
      }
    </>
  );
}