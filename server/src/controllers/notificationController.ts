import type { Request, Response } from 'express';
import { notificationService } from '../services/resourceServices';
import { notificationRepository } from '../repositories';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { broadcastNotification } from '../sockets/socketServer';

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, meta } = await notificationService.list(req.query as Record<string, unknown>);
    sendSuccess(res, { data: items, meta });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = (await notificationService.create(req.body)) as {
      id: string;
      title: string;
      message: string;
      type: 'info' | 'success' | 'warning' | 'error';
    };
    broadcastNotification({
      id: created.id,
      title: created.title,
      message: created.message,
      type: created.type,
      timestamp: new Date().toISOString(),
    });
    sendSuccess(res, { data: created, message: 'Notification created' }, 201);
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const updated = await notificationRepository.updateById(req.params.id, { read: true });
    if (!updated) throw AppError.notFound('Notification not found');
    sendSuccess(res, { data: updated, message: 'Marked as read' });
  }),

  markAllRead: asyncHandler(async (_req: Request, res: Response) => {
    await notificationRepository.updateMany({ read: false }, { read: true });
    sendSuccess(res, { data: null, message: 'All notifications marked as read' });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.remove(req.params.id);
    sendSuccess(res, { data: null, message: 'Notification deleted' });
  }),
};
