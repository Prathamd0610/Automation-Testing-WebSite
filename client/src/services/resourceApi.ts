import { apiClient } from './apiClient';
import type { ApiResponse, ListParams } from '@/types/api';

export interface ResourceApi<T> {
  list: (params?: ListParams) => Promise<ApiResponse<T[]>>;
  get: (id: string) => Promise<T>;
  create: (payload: Partial<T>) => Promise<T>;
  update: (id: string, payload: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

/** Builds a typed CRUD client for a REST resource path (e.g. `/products`). */
export function createResourceApi<T>(path: string): ResourceApi<T> {
  return {
    async list(params) {
      const { data } = await apiClient.get<ApiResponse<T[]>>(path, { params });
      return data;
    },
    async get(id) {
      const { data } = await apiClient.get<ApiResponse<T>>(`${path}/${id}`);
      return data.data;
    },
    async create(payload) {
      const { data } = await apiClient.post<ApiResponse<T>>(path, payload);
      return data.data;
    },
    async update(id, payload) {
      const { data } = await apiClient.put<ApiResponse<T>>(`${path}/${id}`, payload);
      return data.data;
    },
    async remove(id) {
      await apiClient.delete(`${path}/${id}`);
    },
  };
}
