/* eslint-disable */

import {combineReducers, configureStore} from '@reduxjs/toolkit'
import modelPartSlice from "@/slices/ModelPartSlice.ts"
import settingsSlice from "@/slices/SettingsSlice.ts"
import {createStateSyncMiddleware, initStateWithPrevTab, withReduxStateSync} from "redux-state-sync"
import modelSlice from "@/slices/ModelSlice.ts";


const store = configureStore({
    reducer: withReduxStateSync(combineReducers({
        modelParts: modelPartSlice,
        settings: settingsSlice,
        model: modelSlice,
    })),

    // @ts-ignore Middleware type from redux is not type supported (see comments)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createStateSyncMiddleware()),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

initStateWithPrevTab(store);
export default store;