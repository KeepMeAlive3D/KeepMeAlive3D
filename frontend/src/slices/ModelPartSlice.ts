import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/store.ts";
import {Mesh} from "three";


// Define a type for the slice state
interface ModelPartState {
    parts: Array<Mesh>
}

// Define the initial state using that type
const initialState: ModelPartState = {
    parts: [],
}

export const modelPartSlice = createSlice({
    name: 'modelParts',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Mesh>) => {
            state.parts.push(action.payload);
        },
    },
})

export const {add} = modelPartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectModelParts = (state: RootState) => state.modelParts

export default modelPartSlice.reducer