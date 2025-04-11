import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";
import { getModelSettings, ModelSetting } from "@/service/upload.ts";

export const fetchAndSetModelSettings = createAsyncThunk(
  "model/fetchAndSetSettings",
  async ({ modelId }: { modelId: number }, thunkAPI) => {
    try {
      const response = await getModelSettings(modelId);
      const setting: ModelSetting = response.data;
      return setting;
    } catch {
      //unused, user can set this himself in case of an error
      console.error(`Could not load settings`);
      return thunkAPI.rejectWithValue("Failed to get model setting");
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetModelSettings.fulfilled, (state, action) => {
      state.light = action.payload.lightIntensity;
      state.scale = action.payload.scale;
    });
  },
});

export const { setLight, setScale } = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState) => state.settings;

export type { SettingsState };

export default settingsSlice.reducer;
