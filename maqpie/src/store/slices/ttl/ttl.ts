import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../..";

export interface Ttl {
  label: string;
  device: string;
  value: boolean;
  isOverride: boolean;
  overrideValue: boolean;
}

export interface TtlState {
  ttls: Ttl[];
}

const initialState: TtlState = {
  ttls: [],
};

export const ttlSlice = createSlice({
  name: 'ttl',
  initialState,
  reducers: {},
});

export const ttlActions = ttlSlice.actions;
export const selectTtl = (state: RootState) => state.ttl;

export default ttlSlice.reducer;
