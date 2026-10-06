import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiError, toApiError } from '../../api/errors';
import { authApi } from './api/auth.api';
import type { AuthState, Credentials, User } from './auth.types';

const initialState: AuthState = { status: 'unknown', user: null, error: null };
type ThunkConfig = { state: { auth: AuthState }; rejectValue: ApiError };

/** Asks the server who we are (cookies decide). Runs once at startup; can be retried after a network error. */
export const initializeSession = createAsyncThunk<User, void, ThunkConfig>(
  'auth/initializeSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (e) {
      return rejectWithValue(toApiError(e));
    }
  },
  { condition: (_, { getState }) => ['unknown', 'error'].includes(getState().auth.status) },
);

export const login = createAsyncThunk<User, Credentials, ThunkConfig>('auth/login', async (c, { rejectWithValue }) => {
  try {
    return await authApi.login(c);
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const logout = createAsyncThunk<void, void, ThunkConfig>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout(); // the server must revoke the session; clearing Redux alone is not a logout
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Dispatched by the Axios layer when a refresh is definitively rejected. */
    sessionEnded(state) {
      state.status = 'unauthenticated';
      state.user = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(initializeSession.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    })
      .addCase(initializeSession.fulfilled, (s, a) => {
        s.status = 'authenticated';
        s.user = a.payload;
      })
      .addCase(initializeSession.rejected, (s, a) => {
        if (a.meta.condition) return;
        s.user = null;
        s.error = a.payload ?? null;
        s.status = a.payload?.status === 0 || (a.payload?.status ?? 0) >= 500 ? 'error' : 'unauthenticated';
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'authenticated';
        s.user = a.payload;
        s.error = null;
      })
      .addCase(logout.fulfilled, (s) => {
        s.status = 'unauthenticated';
        s.user = null;
      });
  },
});

export const { sessionEnded } = authSlice.actions;
export default authSlice.reducer;
