import { configureStore } from '@reduxjs/toolkit';

import experimentReducer from './slices/experiment/experiment';
import scheduleReducer from './slices/schedule/schedule';
import ttlReducer from './slices/ttl/ttl';

export const store = configureStore({
  reducer: {
    experiment: experimentReducer,
    schedule: scheduleReducer,
    ttl: ttlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
