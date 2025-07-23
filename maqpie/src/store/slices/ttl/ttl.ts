import { createSlice } from "@reduxjs/toolkit";

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

export const ttlSlice = createSlice({
  name: 'ttl',
  initialState,
  reducers: {},
});

export const ttlActions = ttlSlice.actions;
export const selectTtl = (state: RootState) => state.ttl;

export default ttlSlice.reducer;
