import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
// import { api } from '../services/api'; // Nếu sử dụng RTK Query

export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(api.middleware), // Nếu sử dụng RTK Query
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;