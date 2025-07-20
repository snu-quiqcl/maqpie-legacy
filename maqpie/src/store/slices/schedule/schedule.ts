import type { DateTime } from 'luxon';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';

export type RunStatus = (
  'pending' | 'preparing' | 'prepare_done' | 'running' | 'run_done' | 'analyzing' | 'deleting' |
  'paused'
);

export interface Run {
  rid: number;
  cls: string | null;
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
  reducers: {},
});

export const scheduleActions = scheduleSlice.actions;
export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
