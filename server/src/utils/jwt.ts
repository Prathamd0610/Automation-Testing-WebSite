import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type UserRole = 'user' | 'admin';

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

const accessOptions: jwt.SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
};

const refreshOptions: jwt.SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
};

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, accessOptions);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as jwt.Secret, refreshOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET as jwt.Secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET as jwt.Secret) as TokenPayload;
}
