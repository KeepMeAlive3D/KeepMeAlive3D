import type { StateData } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import { findState } from "@/scene/dt/participant/stateMachine/canvas/scUtil.ts";

import { useMemo } from 'react';
import { Arrow } from 'react-konva';
import { useAppSelector } from "@/hooks/hooks.ts";
import { useTheme } from "@/components/theme-provider.tsx";

export function DrawArrows({participantId, dtId, scId}: {
  participantId: number,
  dtId: number,
  scId: number
}) {
  const { theme } = useTheme();

  const instanceId = `${dtId}-${participantId}-${scId}`;
  const sm = useAppSelector((state) => state.sm.instances[instanceId]);

  // 1. Move helper functions outside or wrap them to prevent re-creation
  const getConnectorPoints = (from: StateData, to: StateData) => {
    const dx = to.absX - from.absX;
    const dy = to.absY - from.absY;
    const angle = Math.atan2(-dy, dx);

    const radius = 30;

    return [
      from.absX + -radius * Math.cos(angle + Math.PI),
      from.absY + radius * Math.sin(angle + Math.PI),
      to.absX + -radius * Math.cos(angle),
      to.absY + radius * Math.sin(angle),
    ];
  };

  const connections = useMemo(() => {
    const cooState: StateData[][] = [];

    function collect(state: StateData) {
      state.connectedTo.forEach(it => {
        const to = findState(sm.states, it);
        if (to) cooState.push([state, to]);
      });
      state.childStates.forEach(collect);
    }

    sm.states.forEach(collect);
    return cooState;
  }, [sm]); // Re-run whenever stateMachine reference changes

  return (
    <>
      {connections.map(([from, to]) => (
        <Arrow
          key={`arrow-${from.id}-${to.id}`}
          points={getConnectorPoints(from, to)}
          fill={theme === 'light' ? '#000' : '#fff'}
          stroke={theme === 'light' ? '#000' : '#fff'}
          strokeWidth={2}
        />
      ))}
    </>
  );
}