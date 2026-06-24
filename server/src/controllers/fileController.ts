import type { Request, Response } from 'express';
import { fileService } from '../services/fileService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const fileController = {
  upload: asyncHandler(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const saved = await fileService.saveUploaded(files, req.user?.email);
    sendSuccess(res, { data: saved, message: `Uploaded ${saved.length} file(s)` }, 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, meta } = await fileService.list(req.query as Record<string, unknown>);
    sendSuccess(res, { data: items, meta });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const file = await fileService.getById(req.params.id);
    sendSuccess(res, { data: file });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await fileService.removeWithFile(req.params.id);
    sendSuccess(res, { data: null, message: 'File deleted' });
  }),
};
