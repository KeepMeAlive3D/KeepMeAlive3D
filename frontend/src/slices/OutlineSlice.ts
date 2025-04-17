import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";

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
