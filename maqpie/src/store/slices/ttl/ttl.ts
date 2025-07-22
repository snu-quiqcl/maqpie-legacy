import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../..";

export const ttlSlice = createSlice({
  name: 'ttl',
  initialState: {},
  reducers: {},
});

export const ttlActions = ttlSlice.actions;
export const selectTtl = (state: RootState) => state.ttl;

export default ttlSlice.reducer;
