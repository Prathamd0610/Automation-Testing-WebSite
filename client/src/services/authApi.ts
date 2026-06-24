import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';
import type { ApiResponse, User } from '@/types/api';

interface AuthData {
  user: User;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/login', payload);
    tokenStorage.set(data.data.accessToken);
    return data.data.user;
  },

  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/register', payload);
    tokenStorage.set(data.data.accessToken);
    return data.data.user;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    tokenStorage.clear();
  },
};
