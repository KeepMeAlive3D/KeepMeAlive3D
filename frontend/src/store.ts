import {combineReducers, configureStore} from '@reduxjs/toolkit'
import modelPartSlice from "@/slices/ModelPartSlice.ts"
import settingsSlice from "@/slices/SettingsSlice.ts"
import {createStateSyncMiddleware, initStateWithPrevTab, withReduxStateSync} from "redux-state-sync"

const store = configureStore({
    reducer: withReduxStateSync(combineReducers({
        modelParts: modelPartSlice,
        settings: settingsSlice,
    })),

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createStateSyncMiddleware()),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

initStateWithPrevTab(store);
export default store;