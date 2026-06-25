import { apiClient } from './apiClient';
import type { ApiResponse, ListParams, User, UserRole } from '@/types/api';
import type {
  AdminStats,
  Account,
  Transaction,
  AuditLog,
  AdjustAccountPayload,
  BroadcastPayload,
} from '@/types/admin';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
}

/** Typed client for the admin-only `/admin` API surface. */
export const adminApi = {
  async getStats(): Promise<AdminStats> {
    const { data } = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return data.data;
  },

  // Users
  async listUsers(params?: ListParams): Promise<ApiResponse<User[]>> {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/admin/users', { params });
    return data;
  },
  async createUser(payload: CreateUserPayload): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<User>>('/admin/users', payload);
    return data.data;
  },
  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}`, payload);
    return data.data;
  },
  async changeRole(id: string, role: UserRole): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/role`, { role });
    return data.data;
  },
  async setActive(id: string, isActive: boolean): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/active`, {
      isActive,
    });
    return data.data;
  },
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },
  async revokeSessions(id: string): Promise<void> {
    await apiClient.post(`/admin/users/${id}/revoke-sessions`);
  },
  async resetPassword(id: string, password: string): Promise<void> {
    await apiClient.post(`/admin/users/${id}/reset-password`, { password });
  },

  // Accounts & transactions
  async listAccounts(params?: ListParams): Promise<ApiResponse<Account[]>> {
    const { data } = await apiClient.get<ApiResponse<Account[]>>('/admin/accounts', { params });
    return data;
  },
  async getUserAccount(id: string): Promise<Account> {
    const { data } = await apiClient.get<ApiResponse<Account>>(`/admin/users/${id}/account`);
    return data.data;
  },
  async adjustAccount(
    id: string,
    payload: AdjustAccountPayload,
  ): Promise<{ account: Account; transaction: Transaction }> {
    const { data } = await apiClient.post<ApiResponse<{ account: Account; transaction: Transaction }>>(
      `/admin/users/${id}/account/adjust`,
      payload,
    );
    return data.data;
  },
  async listTransactions(params?: ListParams): Promise<ApiResponse<Transaction[]>> {
    const { data } = await apiClient.get<ApiResponse<Transaction[]>>('/admin/transactions', {
      params,
    });
    return data;
  },

  // Audit
  async listAuditLogs(params?: ListParams): Promise<ApiResponse<AuditLog[]>> {
    const { data } = await apiClient.get<ApiResponse<AuditLog[]>>('/admin/audit-logs', { params });
    return data;
  },

  // Broadcast
  async broadcast(payload: BroadcastPayload): Promise<{ recipients: number }> {
    const { data } = await apiClient.post<ApiResponse<{ recipients: number }>>(
      '/admin/notifications/broadcast',
      payload,
    );
    return data.data;
  },
};
