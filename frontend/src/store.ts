import {configureStore} from '@reduxjs/toolkit'
import modelPartSlice from "@/slices/ModelPartSlice.ts";

const store = configureStore({
    reducer: {
        modelParts: modelPartSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;