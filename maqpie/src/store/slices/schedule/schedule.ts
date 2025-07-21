import { DateTime } from 'luxon';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';

export const RUN_STATUSES = [
  'pending',
  'preparing',
  'prepare_done',
  'running',
  'run_done',
  'analyzing',
  'deleting',
  'paused'
] as const;

export type RunStatus = typeof RUN_STATUSES[number];

export interface Run {
  rid: number;
  cls: string | null;
  file: string | null;
  status: RunStatus;
  pipeline: string;
  priority: number;
  due_date: DateTime | null;
  args: object;
}

export interface ScheduleState {
  runs: Run[];
}

const initialState: ScheduleState = {
  runs: [],
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    updateRuns: (state, action: PayloadAction<{ rawRuns: object }>) => {
      const { rawRuns } = action.payload;
      const runs = Object.entries(rawRuns).map(([rid, rawRun]) => ({
        rid: parseInt(rid),
        cls: rawRun.expid.class_name ?? null,
        file: rawRun.expid.file ?? null,
        status: rawRun.status,
        pipeline: rawRun.pipeline,
        priority: rawRun.priority,
        due_date: rawRun.due_date && DateTime.fromSeconds(rawRun.due_date),
        args: rawRun.expid.arguments,
      }));
      state.runs = runs;
    },
  },
});

export const scheduleActions = scheduleSlice.actions;
export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
