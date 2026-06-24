import type { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SuccessPayload<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

/** Standardized success envelope used by every controller. */
export function sendSuccess<T>(
  res: Response,
  payload: SuccessPayload<T>,
  statusCode = 200,
): Response {
  return res.status(statusCode).json({
    success: true,
    message: payload.message,
    data: payload.data,
    ...(payload.meta ? { meta: payload.meta } : {}),
  });
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
