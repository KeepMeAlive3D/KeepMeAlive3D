import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store.ts";

/**
 * The objectId of the currently outline object. Undefined if no object is
 * outlined.
 */
interface OutlineState {
  id?: number;
}

const initialState: OutlineState = {};

export const outlineSlice = createSlice({
  name: "outline",
  initialState,
  reducers: {
    setOutlinedObject: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
  },
});

export const { setOutlinedObject } = outlineSlice.actions;

export const selectOutline = (state: RootState) => state.outline;

export type { OutlineState };

export default outlineSlice.reducer;
