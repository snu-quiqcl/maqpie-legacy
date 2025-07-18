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

export type ScanKind = 'NoScan' | 'RangeScan' | 'CenterScan' | 'ExplicitScan';

export interface Scan {
  kind: ScanKind;
}

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

export interface ScanInfo {
  selected: ScanKind;
  NoScan: NoScan;
  RangeScan: RangeScan;
  CenterScan: CenterScan;
  ExplicitScan: ExplicitScan;
}

export interface ScanArg extends Arg<ScanInfo> {
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
        } as Arg<any>;
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
          const type = info.type !== 'auto' ? info.type : (
            info.ndecimals === 0 && info.scale === 1 && Number.isInteger(info.step) ?
            'int' :
            'float'
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
            type: type,
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
          const def = {
            selected: info.default ? info.default[0].ty : 'NoScan',
          } as ScanInfo;
          const noScan = info.default.find((d: any) => d.ty === 'NoScan');
          if (noScan) {
            def.NoScan = {
              kind: 'NoScan',
              value: noScan.value,
              repetitions: noScan.repetitions,
            } as NoScan;
          } else {
            def.NoScan = {
              kind: 'NoScan',
              value: info.global_min !== null ? info.global_min : (
                info.global_max !== null ? info.global_max : 0
              ),
              repetitions: 0,
            } as NoScan;
          }
          const rangeScan = info.default.find((d: any) => d.ty === 'RangeScan');
          if (rangeScan) {
            def.RangeScan = {
              kind: 'RangeScan',
              start: rangeScan.start,
              stop: rangeScan.stop,
              npoints: rangeScan.npoints,
              randomize: rangeScan.randomize,
              seed: rangeScan.seed,
            } as RangeScan;
          } else {
            def.RangeScan = {
              kind: 'RangeScan',
              start: info.global_min !== null ? info.global_min : (
                info.global_max !== null ? info.global_max : 0
              ),
              stop: info.global_max !== null ? info.global_max : (
                info.global_min !== null ? info.global_min : 0
              ),
              npoints: 0,
              randomize: false,
              seed: null,
            } as RangeScan;
          }
          const centerScan = info.default.find((d: any) => d.ty === 'CenterScan');
          if (centerScan) {
            def.CenterScan = {
              kind: 'CenterScan',
              center: centerScan.center,
              span: centerScan.span,
              step: centerScan.step,
              randomize: centerScan.randomize,
              seed: centerScan.seed,
            } as CenterScan;
          } else {
            def.CenterScan = {
              kind: 'CenterScan',
              center: info.global_min !== null ? info.global_min : (
                info.global_max !== null ? info.global_max : 0
              ),
              span: 0,
              step: 0,
              randomize: false,
              seed: null,
            } as CenterScan;
          }
          const explicitScan = info.default.find((d: any) => d.ty === 'ExplicitScan');
          if (explicitScan) {
            def.ExplicitScan = {
              kind: 'ExplicitScan',
              sequence: explicitScan.sequence,
            } as ExplicitScan;
          } else {
            def.ExplicitScan = {
              kind: 'ExplicitScan',
              sequence: [],
            } as ExplicitScan;
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
