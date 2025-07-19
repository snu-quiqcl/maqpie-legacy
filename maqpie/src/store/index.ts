import { configureStore } from '@reduxjs/toolkit';

import experimentReducer from './slices/experiment/experiment';

export const store = configureStore({
  reducer: {
    experiment: experimentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
