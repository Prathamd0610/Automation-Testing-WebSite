import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { adminService } from '../services/adminService';
import { Transaction } from '../models/Transaction';

/** Returns the signed-in user's account, creating an empty one on first access. */
export const getMyAccount = asyncHandler(async (req: Request, res: Response) => {
  const account = await adminService.getOrCreateAccount(req.user!.sub);
  sendSuccess(res, { data: account });
});

/** Returns the signed-in user's recent transactions. */
export const getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const items = await Transaction.find({ user: req.user!.sub })
    .sort({ createdAt: -1 })
    .limit(limit);
  sendSuccess(res, { data: items });
});

/** Moves money between the signed-in user's own checking/savings accounts. */
export const transfer = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const { from, to, amount, description } = req.body as {
    from: 'checking' | 'savings';
    to: 'checking' | 'savings';
    amount: number;
    description?: string;
  };

  const account = await adminService.getOrCreateAccount(userId);
  if (account[from] < amount) {
    throw AppError.badRequest(`Insufficient ${from} balance`);
  }

  account[from] -= amount;
  account[to] += amount;
  await account.save();

  await Transaction.create([
    {
      user: userId,
      account: from,
      type: 'debit',
      amount,
      balanceAfter: account[from],
      description: description ?? `Transfer to ${to}`,
      performedBy: userId,
    },
    {
      user: userId,
      account: to,
      type: 'credit',
      amount,
      balanceAfter: account[to],
      description: description ?? `Transfer from ${from}`,
      performedBy: userId,
    },
  ]);

  sendSuccess(res, { data: account, message: 'Transfer complete' });
});
