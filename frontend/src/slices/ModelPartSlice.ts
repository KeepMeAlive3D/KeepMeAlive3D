import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";
import { Vector3Like } from "three";

export type ComponentInformation = {
  id: number;
  name: string;
  isSelected: boolean;
  topic: string;
  limits?: Array<ComponentLimit>;
};
// TODO: refactor -> put types in own file
export type ComponentLimit = {
  name: string;
  standardBasisVector: Vector3State;
  defaultWorldPosition: Vector3Like;
}

// TODO: use Vector3Like
export interface Vector3State {
  x?: number;
  y?: number;
  z?: number;
}

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
    addPart: (state, action: PayloadAction<ComponentInformation>) => {
      state.partIds.push(action.payload);
    },
    clearPartsList: (state) => {
      state.partIds = [];
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

export const { addPart, clearPartsList, toggleIsSelected } = modelPartSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModelParts = (state: RootState) => state.modelParts;

export type { ModelPartState };

export default modelPartSlice.reducer;
