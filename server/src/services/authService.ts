import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories';
import { auditLogRepository } from '../repositories';
import type { UserDocument } from '../models/User';
import { AppError } from '../utils/AppError';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type TokenPayload,
} from '../utils/jwt';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: Record<string, unknown>;
}

interface AuditContext {
  ip?: string;
  userAgent?: string;
}

function buildPayload(user: UserDocument): TokenPayload {
  return { sub: user.id, email: user.email, role: user.role };
}

async function issueTokens(user: UserDocument): Promise<AuthTokens> {
  const payload = buildPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  return { accessToken, refreshToken };
}

class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    ctx: AuditContext = {},
  ): Promise<AuthResult> {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw AppError.conflict('Email is already registered');

    const user = (await userRepository.create({ name, email, password })) as UserDocument;
    const tokens = await issueTokens(user);
    await this.audit('user.register', user, ctx);
    return { ...tokens, user: user.toJSON() };
  }

  async login(email: string, password: string, ctx: AuditContext = {}): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithSecrets(email);
    if (!user) throw AppError.unauthorized('Invalid email or password');
    if (!user.isActive) throw AppError.forbidden('Account is deactivated');

    const valid = await user.comparePassword(password);
    if (!valid) throw AppError.unauthorized('Invalid email or password');

    user.lastLoginAt = new Date();
    const tokens = await issueTokens(user);
    await this.audit('user.login', user, ctx);
    return { ...tokens, user: user.toJSON() };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    if (!refreshToken) throw AppError.unauthorized('Refresh token missing');

    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized('Invalid refresh token');
    }

    const user = await userRepository.findByIdWithSecrets(payload.sub);
    if (!user || !user.refreshTokenHash) throw AppError.unauthorized('Session expired');

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) throw AppError.unauthorized('Session expired');

    const tokens = await issueTokens(user); // rotation
    return { ...tokens, user: user.toJSON() };
  }

  async logout(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (user) {
      (user as UserDocument).refreshTokenHash = undefined;
      await user.save();
    }
  }

  async getProfile(userId: string): Promise<Record<string, unknown>> {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    return user.toJSON();
  }

  private async audit(action: string, user: UserDocument, ctx: AuditContext): Promise<void> {
    await auditLogRepository.create({
      action,
      entity: 'User',
      entityId: user.id,
      actor: user.email,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
  }
}

export const authService = new AuthService();
