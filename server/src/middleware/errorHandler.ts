import type { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';
import { isProduction } from '../config/env';

interface ErrorBody {
  success: false;
  message: string;
  details?: unknown;
  stack?: string;
}

/** Catch-all for unmatched routes. */
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Global error handler. Normalizes framework, validation and database errors
 * into a consistent JSON envelope and never leaks stack traces in production.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.flatten().fieldErrors;
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [key, value.message]),
    );
  } else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err instanceof MongoServerError && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {}).join(', ');
    message = `Duplicate value for unique field: ${field}`;
  } else if (err instanceof Error && err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err instanceof Error && err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  if (statusCode >= 500) {
    logger.error(err instanceof Error ? err.stack || err.message : String(err));
  }

  const body: ErrorBody = { success: false, message };
  if (details !== undefined) body.details = details;
  if (!isProduction && err instanceof Error) body.stack = err.stack;

  res.status(statusCode).json(body);
}
