import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { appEnv } from '@/lib/env';
import { tokenStorage } from './tokenStorage';

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: appEnv.apiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Attach the bearer token (cookies still work server-side; this aids API testers).
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single-flight refresh so concurrent 401s trigger only one refresh call.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post<{ data: { accessToken: string } }>(
      `${appEnv.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const token = data.data.accessToken;
    tokenStorage.set(token);
    return token;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const token = await refreshPromise;
      refreshPromise = null;

      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  },
);

/** Extracts a human-friendly message from an Axios error. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; details?: unknown }
      | undefined;
    const message = data?.message ?? error.message ?? fallback;

    // Surface server-side field validation details so users know exactly what
    // to fix instead of a generic "Validation failed".
    const fieldErrors = flattenFieldErrors(data?.details);
    return fieldErrors ? `${message}: ${fieldErrors}` : message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * Turns a Zod-style `{ field: ["msg", ...] }` (or `{ field: "msg" }`) details
 * object into a short, readable string. Returns null when there is nothing
 * useful to show.
 */
function flattenFieldErrors(details: unknown): string | null {
  if (!details || typeof details !== 'object') return null;
  const parts = Object.entries(details as Record<string, unknown>)
    .map(([field, value]) => {
      const text = Array.isArray(value) ? value.join(', ') : String(value);
      return text ? `${field} — ${text}` : '';
    })
    .filter(Boolean);
  return parts.length ? parts.join('; ') : null;
}

export type { AxiosRequestConfig };
