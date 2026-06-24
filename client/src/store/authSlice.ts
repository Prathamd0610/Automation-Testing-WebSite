import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type LoginPayload, type RegisterPayload } from '@/services/authApi';
import { getErrorMessage } from '@/services/apiClient';
import { tokenStorage } from '@/services/tokenStorage';
import type { User } from '@/types/api';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Login failed'));
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authApi.register(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Registration failed'));
    }
  },
);

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authApi.me();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout().catch(() => undefined);
  tokenStorage.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setAuthenticated = (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'authenticated';
      state.error = null;
    };

    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, setAuthenticated)
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, setAuthenticated)
      .addCase(register.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = (action.payload as string) ?? 'Registration failed';
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMe.fulfilled, setAuthenticated)
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
