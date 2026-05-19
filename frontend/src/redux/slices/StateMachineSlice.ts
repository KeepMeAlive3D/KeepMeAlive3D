import { createSlice } from "@reduxjs/toolkit";
import type { StateData, StateMachine } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";

interface StateMachineRegistry {
  instances: Record<string, StateMachine>;
}

const initialState: StateMachineRegistry = {
  instances: {}
};

const stateMachineSlice = createSlice({
  name: 'stateMachine',
  initialState,
  reducers: {
    updateNodePosition: (state, action) => {
      const { instanceId, id, x, y, width, height, absX, absY } = action.payload;

      const sm = state.instances[instanceId];
      if (!sm) return;

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

      updateRecursive(sm.states);
    },

    updateStateMachine: (state, action) => {
      const data: StateMachine = action.payload;
      // Use a unique key based on the participant/process
      const instanceId = `${data.dtId}-${data.pId}-${data.id}`;
      state.instances[instanceId] = data;
    }
  }
});

export const { updateNodePosition, updateStateMachine } = stateMachineSlice.actions;

export default stateMachineSlice.reducer
