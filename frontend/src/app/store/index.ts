import { configureStore } from '@reduxjs/toolkit';
import songReducer from '../features/songs/songSlice';

export const store = configureStore({
  reducer: {
    songs: songReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 