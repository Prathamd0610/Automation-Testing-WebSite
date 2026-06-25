import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, buildPaginationMeta } from '../utils/response';
import { AppError } from '../utils/AppError';
import { recordAudit } from '../services/auditService';
import { adminService } from '../services/adminService';
import { userService } from '../services/resourceServices';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';
import { broadcastNotification } from '../sockets/socketServer';

/** Throws if the admin is targeting their own account for a protected action. */
function assertNotSelf(req: Request, targetId: string): void {
  if (req.user?.sub === targetId) {
    throw AppError.forbidden('You cannot perform this action on your own admin account');
  }
}

function getPagination(req: Request): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

async function loadUserOrThrow(id: string) {
  const user = await User.findById(id);
  if (!user) throw AppError.notFound('User not found');
  return user;
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats();
  sendSuccess(res, { data: stats });
});

// ── Users ────────────────────────────────────────────────────────────────────
export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await userService.list(req.query);
  sendSuccess(res, { data: items, meta });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  await recordAudit({
    actor: req.user?.email,
    action: 'user.create',
    entity: 'User',
    metadata: { email: req.body.email, role: req.body.role },
    req,
  });
  sendSuccess(res, { data: user, message: 'User created' }, 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.update(req.params.id, req.body);
  sendSuccess(res, { data: user, message: 'User updated' });
});

export const changeRole = asyncHandler(async (req: Request, res: Response) => {
  assertNotSelf(req, req.params.id);
  const user = await loadUserOrThrow(req.params.id);
  const previous = user.role;
  user.role = req.body.role;
  await user.save();
  await recordAudit({
    actor: req.user?.email,
    action: 'user.role.update',
    entity: 'User',
    entityId: user.id,
    metadata: { email: user.email, from: previous, to: user.role },
    req,
  });
  sendSuccess(res, { data: user, message: `Role updated to ${user.role}` });
});

export const setActive = asyncHandler(async (req: Request, res: Response) => {
  assertNotSelf(req, req.params.id);
  const user = await loadUserOrThrow(req.params.id);
  user.isActive = req.body.isActive;
  await user.save();
  await recordAudit({
    actor: req.user?.email,
    action: 'user.active.update',
    entity: 'User',
    entityId: user.id,
    metadata: { email: user.email, isActive: user.isActive },
    req,
  });
  sendSuccess(res, { data: user, message: user.isActive ? 'User activated' : 'User deactivated' });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  assertNotSelf(req, req.params.id);
  const user = await loadUserOrThrow(req.params.id);
  await user.deleteOne();
  await Account.deleteOne({ user: user.id });
  await recordAudit({
    actor: req.user?.email,
    action: 'user.delete',
    entity: 'User',
    entityId: user.id,
    metadata: { email: user.email },
    req,
  });
  sendSuccess(res, { data: null, message: 'User deleted' });
});

export const revokeSessions = asyncHandler(async (req: Request, res: Response) => {
  const user = await loadUserOrThrow(req.params.id);
  await User.findByIdAndUpdate(user.id, { $unset: { refreshTokenHash: '' } });
  await recordAudit({
    actor: req.user?.email,
    action: 'user.sessions.revoke',
    entity: 'User',
    entityId: user.id,
    metadata: { email: user.email },
    req,
  });
  sendSuccess(res, { data: null, message: 'Sessions revoked' });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await loadUserOrThrow(req.params.id);
  user.password = req.body.password;
  await user.save();
  await recordAudit({
    actor: req.user?.email,
    action: 'user.password.reset',
    entity: 'User',
    entityId: user.id,
    metadata: { email: user.email },
    req,
  });
  sendSuccess(res, { data: null, message: 'Password reset' });
});

// ── Accounts & transactions ──────────────────────────────────────────────────
export const listAccounts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const [items, total] = await Promise.all([
    Account.find().populate('user', 'name email role').sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Account.countDocuments(),
  ]);
  sendSuccess(res, { data: items, meta: buildPaginationMeta(total, page, limit) });
});

export const getUserAccount = asyncHandler(async (req: Request, res: Response) => {
  await loadUserOrThrow(req.params.id);
  const account = await adminService.getOrCreateAccount(req.params.id);
  sendSuccess(res, { data: account });
});

export const adjustAccount = asyncHandler(async (req: Request, res: Response) => {
  const user = await loadUserOrThrow(req.params.id);
  const { account, transaction } = await adminService.adjustAccount(
    req.params.id,
    req.body,
    req.user!.sub,
  );
  await recordAudit({
    actor: req.user?.email,
    action: 'account.adjust',
    entity: 'Account',
    entityId: account.id,
    metadata: {
      email: user.email,
      account: req.body.account,
      type: req.body.type,
      amount: req.body.amount,
    },
    req,
  });
  sendSuccess(res, { data: { account, transaction }, message: 'Account adjusted' });
});

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const filter = req.query.user ? { user: req.query.user } : {};
  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .populate('user', 'name email')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, meta: buildPaginationMeta(total, page, limit) });
});

// ── Audit logs ───────────────────────────────────────────────────────────────
export const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const [items, total] = await Promise.all([
    AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(),
  ]);
  sendSuccess(res, { data: items, meta: buildPaginationMeta(total, page, limit) });
});

// ── Broadcast notification ───────────────────────────────────────────────────
export const broadcast = asyncHandler(async (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  const users = await User.find().select('email').lean();
  const docs = users.map((u) => ({ title, message, type, recipient: u.email }));
  if (docs.length > 0) await Notification.insertMany(docs);

  broadcastNotification({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
  });

  await recordAudit({
    actor: req.user?.email,
    action: 'notification.broadcast',
    entity: 'Notification',
    metadata: { title, recipients: docs.length },
    req,
  });

  sendSuccess(res, { data: { recipients: docs.length }, message: 'Notification broadcast' });
});
