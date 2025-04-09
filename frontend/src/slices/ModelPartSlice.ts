import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";
import { Vector3Like } from "three";

/**
 * Contains all additional meta information about a component
 */
export type ComponentInformation = {
  id: number;
  name: string;
  isSelected: boolean;
  topic: string;
  limits?: LimitTuple;
};

/**
 * A tuple which contains two ComponentLimits, the lower and upper.
 */
export type LimitTuple = {
  upper: ComponentLimit;
  lower: ComponentLimit;
}

/**
 * Represents a limit of an animation of an object. The defaultWorldPosition is the world position of the corresponding
 * empty object on loading the scene.
 */
export type ComponentLimit = {
  name: string;
  defaultWorldPosition: Vector3Like;
  defaultWorldRotation: QuaternionLike;
  isUpperLimit: boolean;
}

export type QuaternionLike = {
  x: number;
  y: number;
  z: number;
  w: number;
}

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

export const selectModelParts = (state: RootState) => state.modelParts;

export type { ModelPartState };

export default modelPartSlice.reducer;
