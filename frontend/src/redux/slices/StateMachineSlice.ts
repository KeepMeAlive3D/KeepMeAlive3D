import { createSlice } from "@reduxjs/toolkit";
import type { StateData, StateMachine } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";

const initialState: StateMachine = {
  dtId: 0,
  pId: 0,
  id: 0,
  name: "not defined",
  initial: "not defined",
  states: []
}

const stateMachineSlice = createSlice({
  name: 'stateMachine',
  initialState,
  reducers: {
    updateNodePosition: (state, action) => {
      const { id, x, y, width, height, absX, absY } = action.payload;

      // Recursive helper to find the node inside the draft
      const updateRecursive = (nodes: StateData[]) => {
        for (const node of nodes) {
          if (node.id === id) {
            node.posX = x;
            node.posY = y;
            node.width = width;
            node.height = height;
            node.absX = absX;
            node.absY = absY;
            return true;
          }
          if (node.childStates && updateRecursive(node.childStates)) return true;
        }
        return false;
      };

      updateRecursive(state.states);
    },

    updateStateMachine: (sm, action) => {
      const data: StateMachine = action.payload;
      sm.id = data.id
      sm.dtId = data.dtId
      sm.pId = data.pId
      sm.states = data.states;
      sm.initial = data.initial;
      sm.name = data.name;
    }
  }
});

export const { updateNodePosition, updateStateMachine } = stateMachineSlice.actions;

export default stateMachineSlice.reducer
