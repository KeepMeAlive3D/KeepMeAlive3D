/* eslint-disable */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import modelPartSlice from "@/redux/slices/ModelPartSlice.ts";
import settingsSlice from "@/redux/slices/SettingsSlice.ts";
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
  withReduxStateSync,
} from "redux-state-sync";
import replaySlice from "@/redux/slices/ReplaySlice.ts";
import outlineSlice from "@/redux/slices/OutlineSlice.ts";
import stateMachineSlice from "@/redux/slices/StateMachineSlice.ts";

const store = configureStore({
  reducer: withReduxStateSync(
    combineReducers({
      modelParts: modelPartSlice,
      settings: settingsSlice,
      replay: replaySlice,
      outline: outlineSlice,
      sm: stateMachineSlice
    })
  ),

  // @ts-ignore Middleware type from redux is not type supported (see comments)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createStateSyncMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (window.location.pathname === "/graphs") {
  initStateWithPrevTab(store);
}

export default store;
