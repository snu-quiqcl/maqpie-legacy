import { DateTime } from 'luxon';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../index';

export interface Arg<T> {
  name: string;
  default: T;
}

export interface BooleanArg extends Arg<boolean> {}

export interface EnumerationArg extends Arg<string> {
  choices: string[];
}

export interface NumberArg extends Arg<number> {
  unit: string;
  scale: number;
  step: number;
  min: number;
  max: number;
  ndecimals: number;
  type: string;
}

export interface StringArg extends Arg<string> {}

export interface Scan {}

export interface NoScan extends Scan {
  value: number;
  repetitions: number;
}

export interface RangeScan extends Scan {
  start: number;
  stop: number;
  npoints: number;
  randomize: boolean;
  seed: number | null;
}

export interface CenterScan extends Scan {
  center: number;
  span: number;
  step: number;
  randomize: boolean;
  seed: number | null;
}

export interface ExplicitScan extends Scan {
  sequence: number[];
}

export interface ScanArg extends Arg<Scan> {
  unit: string;
  scale: number;
  global_step: number;
  global_min: number;
  global_max: number;
  ndecimals: number;
}

export interface SchedOpts {
  pipeline: string;
  priority: number;
  timed: DateTime | null;
}

export interface ExperimentInfo {
  name: string;
  tag: string;
  path: string;
  cls: string;
  args: Arg<any>[];
  schedOpts: SchedOpts;
}

export interface ExperimentState {
  experiments: ExperimentInfo[];
}

const initialState: ExperimentState = {
  experiments: [],
};

export const experimentSlice = createSlice({
  name: 'experiment',
  initialState,
  reducers: {},
});

export const experimentActions = experimentSlice.actions;
export const selectExperiment = (state: RootState) => state.experiment;

export default experimentSlice.reducer;
