import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";

/**
 * Contains all additional meta information about a component
 */
export type ComponentInformation = {
  id: number;
  name: string;
  topic: string;
};

interface ModelPartState {
  partIds: Array<ComponentInformation>;
}

const initialState: ModelPartState = {
  partIds: [],
};

export const modelPartSlice = createSlice({
  name: "modelParts",
  initialState,
  reducers: {
    addPart: (state, action: PayloadAction<ComponentInformation>) => {
      state.partIds.push(action.payload);
    },
    clearPartsList: (state) => {
      state.partIds = [];
    },
  },
});

export const { addPart, clearPartsList } = modelPartSlice.actions;

export const selectModelParts = (state: RootState) => state.modelParts;

export type { ModelPartState };

export default modelPartSlice.reducer;
