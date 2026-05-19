import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store.ts";
import { getModelSettings, type ModelSetting } from "@/service/upload.ts";

export const fetchAndSetModelSettings = createAsyncThunk(
  "model/fetchAndSetSettings",
  async ({ modelId }: { modelId: number }, thunkAPI) => {
    try {
      const response = await getModelSettings(modelId);
      const setting: ModelSetting = response.data;
      return setting;
    } catch {
      console.error(`Could not load settings`);
      return thunkAPI.rejectWithValue("Failed to get model setting");
    }
  }
);

/**
 * The settings of a model. Are applied in the Canvas.
 */
interface SettingsState {
  light: number;
  scale: number;
}

const initialState: SettingsState = {
  light: 1,
  scale: 1,
};

export const settingsSlice = createSlice({
  name: "settings",
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

export const selectSettings = (state: RootState) => state.settings;

export type { SettingsState };

export default settingsSlice.reducer;
