import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

/** Tracks attempts per key so the `/flaky` endpoint can fail then succeed. */
const flakyAttempts = new Map<string, number>();

const SAMPLE_NAMES = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Linus Torvalds'];

function echoPayload(req: Request) {
  return {
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString(),
  };
}

export const playgroundController = {
  echo: asyncHandler(async (req: Request, res: Response) => {
    const status = req.method === 'POST' ? 201 : 200;
    res.status(status).json({ success: true, data: echoPayload(req) });
  }),

  /** Returns whatever HTTP status code the tester requests. */
  status: asyncHandler(async (req: Request, res: Response) => {
    const code = Number.parseInt(req.params.code, 10);
    if (Number.isNaN(code) || code < 100 || code > 599) {
      throw AppError.badRequest('Status code must be between 100 and 599');
    }
    res.status(code).json({
      success: code < 400,
      status: code,
      message: `Responded with status ${code}`,
    });
  }),

  /** Delays the response by the requested milliseconds (capped at 10s). */
  delay: asyncHandler(async (req: Request, res: Response) => {
    const ms = Math.min(Math.max(0, Number.parseInt(req.params.ms, 10) || 0), 10000);
    await new Promise((resolve) => setTimeout(resolve, ms));
    res.status(200).json({ success: true, delayedMs: ms, timestamp: new Date().toISOString() });
  }),

  /** Returns a randomized payload; ~20% of calls return a 500 for error practice. */
  random: asyncHandler(async (_req: Request, res: Response) => {
    if (Math.random() < 0.2) {
      throw new AppError('Randomized server error (expected ~20% of the time)', 500);
    }
    res.status(200).json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 100000),
        name: SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)],
        score: Number((Math.random() * 100).toFixed(2)),
        active: Math.random() > 0.5,
        generatedAt: new Date().toISOString(),
      },
    });
  }),

  /**
   * Fails the first `threshold - 1` requests for a given `key`, then succeeds.
   * Perfect for exercising retry logic. Defaults to succeeding on attempt 3.
   */
  flaky: asyncHandler(async (req: Request, res: Response) => {
    const key = String(req.query.key ?? req.ip ?? 'default');
    const threshold = Math.min(Math.max(2, Number.parseInt(String(req.query.threshold ?? '3'), 10) || 3), 10);
    const attempt = (flakyAttempts.get(key) ?? 0) + 1;

    if (attempt < threshold) {
      flakyAttempts.set(key, attempt);
      res.status(503).json({
        success: false,
        message: `Service temporarily unavailable (attempt ${attempt}/${threshold})`,
        attempt,
        threshold,
      });
      return;
    }

    flakyAttempts.delete(key);
    res.status(200).json({
      success: true,
      message: `Succeeded after ${attempt} attempts`,
      attempt,
      threshold,
    });
  }),
};
