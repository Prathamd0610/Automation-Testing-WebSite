import type { CookieOptions, Request, Response } from 'express';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { isProduction } from '../config/env';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const ACCESS_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function cookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
    path: '/',
  };
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
}

function clearAuthCookies(res: Response): void {
  const base: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
  res.clearCookie(ACCESS_COOKIE, base);
  res.clearCookie(REFRESH_COOKIE, base);
}

function auditContext(req: Request) {
  return { ip: req.ip, userAgent: req.headers['user-agent'] };
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password, auditContext(req));
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(
      res,
      { data: { user: result.user, accessToken: result.accessToken }, message: 'Registered' },
      201,
    );
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password, auditContext(req));
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(res, {
      data: { user: result.user, accessToken: result.accessToken },
      message: 'Logged in',
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token =
      (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE] ??
      (req.body?.refreshToken as string | undefined);
    if (!token) throw AppError.unauthorized('Refresh token missing');

    const result = await authService.refresh(token);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(res, {
      data: { user: result.user, accessToken: result.accessToken },
      message: 'Token refreshed',
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    if (req.user) await authService.logout(req.user.sub);
    clearAuthCookies(res);
    sendSuccess(res, { data: null, message: 'Logged out' });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!.sub);
    sendSuccess(res, { data: user });
  }),
};
