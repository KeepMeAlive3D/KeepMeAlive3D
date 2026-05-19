import type { StateData } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";

export function findState(states: StateData[], searchId: string): StateData | undefined {
  let state = states.find(it => it.id === searchId);
  if (state)
    return state;
  for (let i = 0; i < states.length; i++) {
    const childState = findState(states[i].childStates, searchId);
    if (childState) {
      state = childState;
      break;
    }
  }
  if (state)
    return state;
  return undefined;
}
