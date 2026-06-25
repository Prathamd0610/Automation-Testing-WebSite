import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types/api';
import type { Account, Transaction } from '@/types/admin';

export interface TransferPayload {
  from: 'checking' | 'savings';
  to: 'checking' | 'savings';
  amount: number;
  description?: string;
}

/** Client for the signed-in user's own bank account. */
export const accountApi = {
  async getMyAccount(): Promise<Account> {
    const { data } = await apiClient.get<ApiResponse<Account>>('/account');
    return data.data;
  },
  async getMyTransactions(limit = 20): Promise<Transaction[]> {
    const { data } = await apiClient.get<ApiResponse<Transaction[]>>('/account/transactions', {
      params: { limit },
    });
    return data.data;
  },
  async transfer(payload: TransferPayload): Promise<Account> {
    const { data } = await apiClient.post<ApiResponse<Account>>('/account/transfer', payload);
    return data.data;
  },
};
