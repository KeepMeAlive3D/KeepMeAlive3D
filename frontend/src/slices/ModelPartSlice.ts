import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";

export type ComponentInformation = {
  id: number;
  name: string;
  isSelected: boolean;
  topic: string;
};

// Define a type for the slice state
interface ModelPartState {
  partIds: Array<ComponentInformation>;
}

// Define the initial state using that type
const initialState: ModelPartState = {
  partIds: [],
};

export const modelPartSlice = createSlice({
  name: "modelParts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ComponentInformation>) => {
      state.partIds.push(action.payload);
    },
    toggleIsSelected: (state, action: PayloadAction<ComponentInformation>) => {
      const index = state.partIds.findIndex(
        (part) => part.id === action.payload.id
      );
      if (index !== -1) {
        state.partIds[index].isSelected = !state.partIds[index].isSelected;
      }
    },
  },
});

export const { add, toggleIsSelected } = modelPartSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModelParts = (state: RootState) => state.modelParts;

export type { ModelPartState };

export default modelPartSlice.reducer;
