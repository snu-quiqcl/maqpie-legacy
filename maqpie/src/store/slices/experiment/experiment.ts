import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../index';

export const experimentSlice = createSlice({
  name: 'experiment',
  initialState: {},
  reducers: {},
});

export const experimentActions = experimentSlice.actions;
export const selectExperiment = (state: RootState) => state.experiment;

export default experimentSlice.reducer;
