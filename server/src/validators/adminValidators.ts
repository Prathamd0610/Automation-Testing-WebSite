import { z } from 'zod';

/** Change a user's role (admin-only). */
export const changeRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
});

/** Activate / deactivate a user account. */
export const setActiveSchema = z.object({
  isActive: z.boolean(),
});

/** Credit or debit a user's checking/savings account. */
export const adjustAccountSchema = z.object({
  account: z.enum(['checking', 'savings']),
  type: z.enum(['credit', 'debit']),
  amount: z.coerce.number().positive().max(1_000_000_000),
  description: z.string().max(200).optional(),
});

/** Admin-set a new password for a user. */
export const resetPasswordSchema = z.object({
  password: z.string().min(8).max(128),
});

/** Broadcast a notification to all users. */
export const broadcastSchema = z.object({
  title: z.string().min(2).max(120),
  message: z.string().min(2).max(500),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
});
