import { z } from 'zod';

/** Reusable Mongo ObjectId path parameter. */
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id format'),
});

/** Shared list query schema; extra whitelisted filters pass through untouched. */
export const listQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    sort: z.string().max(100).optional(),
    search: z.string().max(200).optional(),
  })
  .passthrough();
