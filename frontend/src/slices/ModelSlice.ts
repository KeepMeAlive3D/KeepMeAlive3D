import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";
import { downloadModel, getLastCreatedModel } from "@/service/upload.ts";

export const fetchAndSetModel = createAsyncThunk(
  "model/fetchAndSetModel",
  async ({ modelId }: { modelId: number | null }, thunkAPI) => {
    try {
      let innerModelId = modelId
      if(innerModelId === null) {
        const model = await getLastCreatedModel()
        innerModelId = model.data.modelId
      }
      const response = await downloadModel(innerModelId);
      const href = URL.createObjectURL(response.data);
      return href;
    } catch {
      return thunkAPI.rejectWithValue("Failed to download model");
    }
  }
);

// Define a type for the slice state
interface ModelState {
  url: string;
  error: string | null;
}

// Define the initial state using that type
const initialState: ModelState = {
  url: "",
  error: null,
};

export const modelSlice = createSlice({
  name: "model",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndSetModel.fulfilled, (state, action) => {
        state.url = action.payload;
      })
      .addCase(fetchAndSetModel.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectModel = (state: RootState) => state.model;

export type { ModelState };

export default modelSlice.reducer;
