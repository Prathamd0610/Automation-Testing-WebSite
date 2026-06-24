import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, register, logout, fetchMe, clearAuthError } from '@/store/authSlice';
import type { LoginPayload, RegisterPayload } from '@/services/authApi';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  const signIn = useCallback((payload: LoginPayload) => dispatch(login(payload)).unwrap(), [dispatch]);
  const signUp = useCallback((payload: RegisterPayload) => dispatch(register(payload)).unwrap(), [dispatch]);
  const signOut = useCallback(() => dispatch(logout()).unwrap(), [dispatch]);
  const loadSession = useCallback(() => dispatch(fetchMe()), [dispatch]);
  const resetError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signUp,
    signOut,
    loadSession,
    resetError,
  };
}
