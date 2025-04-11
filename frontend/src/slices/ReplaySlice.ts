import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store.ts";

interface ReplayState {
  running: boolean;
  startedOn?: number;
  start?: number;
  end?: number;
}

const initialState: ReplayState = {
  running: false,
};

export const replaySlice = createSlice({
  name: "replay",
  initialState,
  reducers: {
    setReplayRunning: (state, action: PayloadAction<boolean>) => {
      state.running = action.payload;
    },
    updateReplay: (state, action: PayloadAction<ReplayState>) => {
      state.running = action.payload.running;
      state.startedOn = action.payload.startedOn;
      state.start = action.payload.start;
      state.end = action.payload.end;
    },
  },
});

export const { setReplayRunning, updateReplay } = replaySlice.actions;

export const selectReplay = (state: RootState) => state.replay;

export type { ReplayState };

export default replaySlice.reducer;
