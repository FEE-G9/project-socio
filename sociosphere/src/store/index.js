import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
