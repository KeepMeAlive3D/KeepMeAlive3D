import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {RootState} from "@/store.ts";
import {downloadModel} from "@/service/upload.ts";


export const fetchAndSetModel = createAsyncThunk(
    "model/fetchAndSetModel",
    async ({name, filename}: { name: string; filename: string }, thunkAPI) => {
        try {
            const response = await downloadModel(name, filename);
            const href = URL.createObjectURL(response.data);
            return href;
        } catch {
            return thunkAPI.rejectWithValue("Failed to download model");
        }
    }
);

// Define a type for the slice state
interface ModelState {
    url: string,
    error: any,
}

// Define the initial state using that type
const initialState: ModelState = {
    url: "",
    error: null,
}

export const modelSlice = createSlice({
    name: 'model',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAndSetModel.fulfilled, (state, action) => {
                state.url = action.payload;
            })
            .addCase(fetchAndSetModel.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
})


export const selectModel = (state: RootState) => state.model

export type {ModelState};

export default modelSlice.reducer