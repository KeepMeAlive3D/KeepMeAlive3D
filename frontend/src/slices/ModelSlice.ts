import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";
import { downloadModel } from "@/service/upload.ts";

export const fetchAndSetModel = createAsyncThunk(
  "model/fetchAndSetModel",
  async ({ modelId }: { modelId: number }, thunkAPI) => {
    try {
      const response = await downloadModel(modelId);
      const href = URL.createObjectURL(response.data);
      const modelState: ModelState = {
        url: href,
        error: null,
        modelId: modelId,
      }
      return modelState
    } catch {
      return thunkAPI.rejectWithValue("Failed to download model");
    }
  }
);

// Define a type for the slice state
interface ModelState {
  url: string;
  error: string | null;
  modelId: number;
}

// Define the initial state using that type
const initialState: ModelState = {
  url: "",
  error: null,
  modelId: -1,
};

export const modelSlice = createSlice({
  name: "model",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    resetModel: (state) => {
      state.url = "";
      state.modelId = -1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndSetModel.fulfilled, (state, action) => {
        state.url = action.payload.url
        state.modelId = action.payload.modelId
      })
      .addCase(fetchAndSetModel.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetModel } = modelSlice.actions;

export const selectModel = (state: RootState) => state.model;

export type { ModelState };

export default modelSlice.reducer;
