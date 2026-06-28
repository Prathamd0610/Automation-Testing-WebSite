/**
 * Centralized, typed access to Vite environment variables. No URL is ever
 * hardcoded elsewhere in the app — everything routes through here.
 */

/**
 * Normalize the API base URL so it always ends with exactly one `/api`.
 *
 * The backend mounts every route under `/api` (`app.use('/api', apiRouter)`),
 * so a deployment whose `VITE_API_URL` omits that suffix (a common mistake when
 * configuring a second host like Cloudflare Pages) would post to
 * `https://<api>/auth/login` and fail with
 * `Route not found: POST /auth/login`. Normalizing here guarantees the correct
 * path regardless of how `VITE_API_URL` is set per environment.
 */
function normalizeApiUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, ''); // drop trailing slash(es)
  if (!trimmed) return 'http://localhost:5000/api';
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

export const appEnv = {
  apiUrl: normalizeApiUrl(import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'),
  appName: import.meta.env.VITE_APP_NAME ?? 'Automation Testing Practice Platform',
  environment: import.meta.env.VITE_ENVIRONMENT ?? 'development',
  adsenseClient: import.meta.env.VITE_ADSENSE_CLIENT ?? 'ca-pub-4944608885960983',
};

/** API origin without the trailing `/api` (used for sockets and static uploads). */
export const apiOrigin = appEnv.apiUrl.replace(/\/api\/?$/, '');
