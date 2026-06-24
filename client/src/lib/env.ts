/**
 * Centralized, typed access to Vite environment variables. No URL is ever
 * hardcoded elsewhere in the app — everything routes through here.
 */
export const appEnv = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'Automation Testing Practice Platform',
  environment: import.meta.env.VITE_ENVIRONMENT ?? 'development',
};

/** API origin without the trailing `/api` (used for sockets and static uploads). */
export const apiOrigin = appEnv.apiUrl.replace(/\/api\/?$/, '');
