import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../..';

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {},
  reducers: {},
});

export const scheduleActions = scheduleSlice.actions;
export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;