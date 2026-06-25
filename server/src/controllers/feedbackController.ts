import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, buildPaginationMeta } from '../utils/response';
import { AppError } from '../utils/AppError';
import { recordAudit } from '../services/auditService';
import { Feedback } from '../models/Feedback';
import { User } from '../models/User';

function getPagination(req: Request): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  return { page, limit, skip: (page - 1) * limit };
}

/** Submit feedback. Name + email are taken from the authenticated session. */
export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.sub);
  if (!user) throw AppError.unauthorized('Account not found');

  const feedback = await Feedback.create({
    user: user.id,
    name: user.name,
    email: user.email,
    type: req.body.type,
    subject: req.body.subject,
    message: req.body.message,
    priority: req.body.priority,
    pageUrl: req.body.pageUrl,
  });

  sendSuccess(res, { data: feedback, message: 'Thanks! Your feedback was submitted.' }, 201);
});

/** Admin: list all feedback, newest first, optionally filtered by status/type. */
export const listFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (typeof req.query.status === 'string') filter.status = req.query.status;
  if (typeof req.query.type === 'string') filter.type = req.query.type;

  const [items, total] = await Promise.all([
    Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feedback.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, meta: buildPaginationMeta(total, page, limit) });
});

/** Admin: update a feedback item's status. */
export const updateFeedbackStatus = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!feedback) throw AppError.notFound('Feedback not found');

  await recordAudit({
    actor: req.user?.email,
    action: 'feedback.status.update',
    entity: 'Feedback',
    entityId: feedback.id,
    metadata: { status: feedback.status },
    req,
  });

  sendSuccess(res, { data: feedback, message: 'Status updated' });
});
