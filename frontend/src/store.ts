import {configureStore} from '@reduxjs/toolkit'

import settingsSlice from "@/slices/SettingsSlice.ts";
import modelPartSlice from "@/slices/ModelPartSlice";

const store = configureStore({
    reducer: {
        modelParts: modelPartSlice,
        settings: settingsSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;