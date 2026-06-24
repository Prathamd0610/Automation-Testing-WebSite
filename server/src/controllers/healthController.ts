import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getConnectionState } from '../config/database';
import { getMetricsSnapshot } from '../middleware/requestMetrics';
import { env } from '../config/env';

const startedAt = Date.now();

export const healthController = {
  /** Liveness + readiness probe. Returns 503 if the database is not connected. */
  health: asyncHandler(async (_req: Request, res: Response) => {
    const dbState = getConnectionState();
    const healthy = dbState === 'connected';
    res.status(healthy ? 200 : 503).json({
      success: healthy,
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      environment: env.NODE_ENV,
      database: dbState,
      version: process.env.npm_package_version ?? '1.0.0',
    });
  }),

  /** Process and request metrics for monitoring dashboards. */
  metrics: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ success: true, data: getMetricsSnapshot() });
  }),
};
