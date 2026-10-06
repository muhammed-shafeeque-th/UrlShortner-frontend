import { configureStore } from '@reduxjs/toolkit';
import { setAuthFailureHandler } from '../api/interceptors';
import { apiSlice } from '../api/apiSlice';
import authReducer, { sessionEnded } from '../features/auth/auth.slice';
import uiReducer from './ui.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});

setAuthFailureHandler(() => {
  store.dispatch(sessionEnded());
  store.dispatch(apiSlice.util.resetApiState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
