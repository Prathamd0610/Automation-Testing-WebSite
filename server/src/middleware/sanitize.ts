import type { NextFunction, Request, Response } from 'express';
import { filterXSS } from 'xss';

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return filterXSS(value, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script'] });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, sanitizeValue(val)]),
    );
  }
  return value;
}

/**
 * Recursively strips HTML/script payloads from the request body, guarding
 * against stored/reflected XSS for any string the user submits.
 */
export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body) as Record<string, unknown>;
  }
  next();
}
