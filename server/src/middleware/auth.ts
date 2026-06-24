import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAccessToken, type UserRole } from '../utils/jwt';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.[ACCESS_COOKIE];
  return cookieToken ?? null;
}

/** Requires a valid access token; attaches the decoded payload to `req.user`. */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    next(AppError.unauthorized('Authentication required'));
    return;
  }
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
}

/** Restricts a route to the given roles. Must run after `authenticate`. */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized('Authentication required'));
      return;
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      next(AppError.forbidden('Insufficient permissions'));
      return;
    }
    next();
  };
}

/** Attaches `req.user` when a valid token is present but never rejects. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // Ignore invalid tokens for optional auth.
    }
  }
  next();
}
