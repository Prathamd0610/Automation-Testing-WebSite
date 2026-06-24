import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

interface ValidationSchemas {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}

/**
 * Validates and coerces request segments against Zod schemas. Parsed values
 * replace the originals so downstream handlers receive typed, sanitized input.
 */
export function validate(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        const parsedQuery = await schemas.query.parseAsync(req.query);
        // req.query has only a getter on some Express versions; mutate in place.
        Object.keys(req.query).forEach((key) => delete (req.query as Record<string, unknown>)[key]);
        Object.assign(req.query, parsedQuery);
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as typeof req.params;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
