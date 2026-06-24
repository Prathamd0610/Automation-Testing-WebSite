import type { Request, RequestHandler, Response } from 'express';
import type { CrudService } from '../services/CrudService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export interface CrudController {
  list: RequestHandler;
  get: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
}

/**
 * Builds a thin HTTP controller that delegates to a CrudService. Keeps routes
 * declarative and ensures every resource exposes a consistent REST surface.
 */
export function createCrudController<T>(service: CrudService<T>): CrudController {
  return {
    list: asyncHandler(async (req: Request, res: Response) => {
      const { items, meta } = await service.list(req.query as Record<string, unknown>);
      sendSuccess(res, { data: items, meta });
    }),

    get: asyncHandler(async (req: Request, res: Response) => {
      const doc = await service.getById(req.params.id);
      sendSuccess(res, { data: doc });
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const doc = await service.create(req.body);
      sendSuccess(res, { data: doc, message: 'Created' }, 201);
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const doc = await service.update(req.params.id, req.body);
      sendSuccess(res, { data: doc, message: 'Updated' });
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
      await service.remove(req.params.id);
      sendSuccess(res, { data: null, message: 'Deleted' });
    }),
  };
}
