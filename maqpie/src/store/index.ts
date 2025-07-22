import { configureStore } from '@reduxjs/toolkit';

import experimentReducer from './slices/experiment/experiment';
import scheduleReducer from './slices/schedule/schedule';

export const store = configureStore({
  reducer: {
    experiment: experimentReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
