import { apiClient } from './apiClient';
import type { ApiResponse, ListParams } from '@/types/api';
import type { Feedback, FeedbackStatus, CreateFeedbackPayload } from '@/types/admin';

/** Submit feedback (any signed-in user) and review it (admin). */
export const feedbackApi = {
  async submit(payload: CreateFeedbackPayload): Promise<Feedback> {
    const { data } = await apiClient.post<ApiResponse<Feedback>>('/feedback', payload);
    return data.data;
  },
  async list(params?: ListParams): Promise<ApiResponse<Feedback[]>> {
    const { data } = await apiClient.get<ApiResponse<Feedback[]>>('/feedback', { params });
    return data;
  },
  async updateStatus(id: string, status: FeedbackStatus): Promise<Feedback> {
    const { data } = await apiClient.patch<ApiResponse<Feedback>>(`/feedback/${id}/status`, {
      status,
    });
    return data.data;
  },
};
