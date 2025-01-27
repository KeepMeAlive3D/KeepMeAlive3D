import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";

// Define a type for the slice state
interface SettingsState {
  light: number;
  scale: number;
}

// Define the initial state using that type
const initialState: SettingsState = {
  light: 1,
  scale: 1,
};

export const settingsSlice = createSlice({
  name: "settings",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLight: (state, action: PayloadAction<number>) => {
      state.light = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
  },
});

export const { setLight, setScale } = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState) => state.settings;

export type { SettingsState };

export default settingsSlice.reducer;
