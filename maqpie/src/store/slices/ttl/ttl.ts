import axios from 'axios';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from "../..";
import { getTtlConfigs } from "../../../config/ttlConfig";

export interface Ttl {
  label: string;
  device: string;
  value: boolean | null;
  isOverride: boolean | null;
  overrideValue: boolean | null;
}

export interface TtlState {
  ttls: Ttl[];
}

const initialState: TtlState = {
  ttls: getTtlConfigs().map((config) => ({
    label: config.label,
    device: config.device,
    value: null,
    isOverride: null,
    overrideValue: null,
  })),
};

export const setIsOverride = createAsyncThunk(
  'ttl/setIsOverride',
  async (payload: Pick<Ttl, 'device' | 'isOverride'>) => {
    const response = await axios.post('/api/ttl/override/', {
      params: {
        devices: [payload.device],
        values: [payload.isOverride],
      },
    });
    return response.data;
  }
);

export const setOverrideValue = createAsyncThunk(
  'ttl/setOverrideValue',
  async (payload: Pick<Ttl, 'device' | 'overrideValue'>) => {
    const response = await axios.post('/api/ttl/override/', {
      params: {
        devices: [payload.device],
        values: [payload.overrideValue],
      },
    });
    return response.data;
  }
);

export const ttlSlice = createSlice({
  name: 'ttl',
  initialState,
  reducers: {
    updateTtls: (state, action: PayloadAction<{ modifications: any }>) => {
      const { modifications } = action.payload;
      Object.entries(modifications.probe).forEach(([device, value]) => {
        const ttl = state.ttls.find((ttl) => ttl.device === device);
        if (ttl) {
          ttl.value = value as boolean;
        }
      });
      Object.entries(modifications.override).forEach(([device, isOverride]) => {
        const ttl = state.ttls.find((ttl) => ttl.device === device);
        if (ttl) {
          ttl.isOverride = isOverride as boolean;
        }
      });
      Object.entries(modifications.level).forEach(([device, overrideValue]) => {
        const ttl = state.ttls.find((ttl) => ttl.device === device);
        if (ttl) {
          ttl.overrideValue = overrideValue as boolean;
        }
      });
    },
  },
});

export const ttlActions = ttlSlice.actions;
export const selectTtl = (state: RootState) => state.ttl;

export default ttlSlice.reducer;
