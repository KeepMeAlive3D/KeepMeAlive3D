import { createListenerMiddleware } from "@reduxjs/toolkit";
import { sendUpdateStateMachine } from "@/scene/dt/participant/stateMachine/data.ts";
import { updateNodePosition } from "@/redux/slices/StateMachineSlice.ts";
import type { RootState } from "@/redux/store.ts";

export const updateBackendMiddleware = createListenerMiddleware();

updateBackendMiddleware.startListening({
  actionCreator: updateNodePosition,
  effect: async (action, listenerApi) => {
    // 1. Get the updated state after the reducer has run
    const { instanceId } = action.payload;
    const state = listenerApi.getState() as RootState;
    const updatedData = state.sm.instances[instanceId];

    if(!updatedData) {
      return;
    }

    if (updatedData.dtId && updatedData.pId && updatedData.id && updatedData.dtId !== 0 && updatedData.pId !== 0 && updatedData.id !== 0)
      await sendUpdateStateMachine(updatedData.dtId, updatedData.pId, updatedData.id, updatedData);
  },
});