import axios from 'axios';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../..';

export type ArgKind = 'BooleanArg' | 'EnumerationArg' | 'NumberArg' | 'StringArg' | 'ScanArg';

export interface Arg<T> {
  id: string;
  kind: ArgKind;
  name: string;
  value: T;
  default: T;
  group: string | null;
  tooltip: string | null;
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
  id: string;
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
        const [info, group, tooltip] = value as any[];
        const baseArg = {
          id: uuidv4(),
          name: name,
          group: group,
          tooltip: tooltip,
        };
        if (info.ty === 'BooleanValue') {
          const def = info.default !== undefined ? info.default : false;
          return {
            ...baseArg,
            kind: 'BooleanArg',
            value: def,
            default: def,
          } as BooleanArg;
        } else if (info.ty === 'EnumerationValue') {
          const def = info.default !== undefined ? info.default : info.choices[0];
          return {
            ...baseArg,
            kind: 'EnumerationArg',
            value: def,
            default: def,
            choices: info.choices,
          } as EnumerationArg;
        } else if (info.ty === 'NumberValue') {
          const def = info.default !== undefined ? info.default : (
            info.min !== null ? info.min : (
              info.max !== null ? info.max : 0
            )
          );
          return {
            ...baseArg,
            kind: 'NumberArg',
            value: def,
            default: def,
            unit: info.unit,
            scale: info.scale,
            step: info.step,
            min: info.min,
            max: info.max,
            ndecimals: info.ndecimals,
            type: info.type,
          } as NumberArg;
        } else if (info.ty === 'StringValue') {
          const def = info.default !== undefined ? info.default : '';
          return {
            ...baseArg,
            kind: 'StringArg',
            value: def,
            default: def,
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
            ...baseArg,
            kind: 'ScanArg',
            value: def,
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
        id: uuidv4(),
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
