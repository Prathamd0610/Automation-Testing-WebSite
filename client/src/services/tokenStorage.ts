const ACCESS_TOKEN_KEY = 'atp_access_token';

/** Small wrapper around localStorage for the access token (refresh stays in an httpOnly cookie). */
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      /* ignore quota/availability errors */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};
