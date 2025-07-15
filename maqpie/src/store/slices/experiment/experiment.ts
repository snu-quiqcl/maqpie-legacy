import axios from 'axios';
import { DateTime } from 'luxon';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../..';

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
  min: number | null;
  max: number | null;
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
  global_min: number | null;
  global_max: number | null;
  ndecimals: number;
}

export interface SchedOpts {
  pipeline: string;
  priority: number;
  timed: DateTime | null;
}

export interface Experiment {
  name: string;
  tag: string;
  path: string;
  cls: string;
  args: Arg<any>[];
  schedOpts: SchedOpts;
}

export interface ExperimentState {
  experiments: Experiment[];
}

const initialState: ExperimentState = {
  experiments: [],
};

export const fetchExperiment = createAsyncThunk(
  'experiment/fetchExperiment',
  async (payload: Pick<Experiment, 'path' | 'cls'>) => {
    const response = await axios.get('/api/experiment/info/', {
      params: {
        file: payload.path,
      },
    });
    return {
      data: response.data,
      path: payload.path,
      cls: payload.cls,
    };
  }
);

export const experimentSlice = createSlice({
  name: 'experiment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExperiment.fulfilled, (state, action) => {
      const { data, path, cls } = action.payload;
      const clsData = data[cls];
      const args = Object.entries(clsData.arginfo).map(([name, value]) => {
        const [info] = value as any[];
        if (info.ty === 'BooleanValue') {
          return {
            name: name,
            default: info.default,
          } as BooleanArg;
        } else if (info.ty === 'EnumerationValue') {
          return {
            name: name,
            default: info.default,
            choices: info.choices,
          } as EnumerationArg;
        } else if (info.ty === 'NumberValue') {
          return {
            name: name,
            default: info.default,
            unit: info.unit,
            scale: info.scale,
            step: info.step,
            min: info.min,
            max: info.max,
            ndecimals: info.ndecimals,
            type: info.type,
          } as NumberArg;
        } else if (info.ty === 'StringValue') {
          return {
            name: name,
            default: info.default,
          } as StringArg;
        } else if (info.ty === 'Scannable') {
          const [defInfo] = info.default as any[];
          let def: Scan;
          if (defInfo.ty === 'NoScan') {
            def = {
              value: defInfo.value,
              repetitions: defInfo.repetitions,
            } as NoScan;
          } else if (defInfo.ty === 'RangeScan') {
            def = {
              start: defInfo.start,
              stop: defInfo.stop,
              npoints: defInfo.npoints,
              randomize: defInfo.randomize,
              seed: defInfo.seed,
            } as RangeScan;
          } else if (defInfo.ty === 'CenterScan') {
            def = {
              center: defInfo.center,
              span: defInfo.span,
              step: defInfo.step,
              randomize: defInfo.randomize,
              seed: defInfo.seed,
            } as CenterScan;
          } else if (defInfo.ty === 'ExplicitScan') {
            def = {
              sequence: defInfo.sequence,
            } as ExplicitScan;
          } else {
            throw new Error(`Unknown scan type: ${defInfo.type}`);
          }
          return {
            name: name,
            default: def,
            unit: info.unit,
            scale: info.scale,
            global_step: info.global_step,
            global_min: info.global_min,
            global_max: info.global_max,
            ndecimals: info.ndecimals,
          } as ScanArg;
        }
        throw new Error(`Unknown argument type: ${info.type}`);
      });
      const experiment = {
        name: clsData.name,
        tag: '',
        path: path,
        cls: cls,
        args: args,
        schedOpts: {
          pipeline: 'main',
          priority: 0,
          timed: null,
        } as SchedOpts,
      } as Experiment;
      state.experiments.push(experiment);
    });
  },
});

export const experimentActions = experimentSlice.actions;
export const selectExperiment = (state: RootState) => state.experiment;

export default experimentSlice.reducer;
