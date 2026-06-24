import type { NextFunction, Request, Response } from 'express';

interface Metrics {
  totalRequests: number;
  byMethod: Record<string, number>;
  byStatusClass: Record<string, number>;
  errors: number;
  totalResponseTimeMs: number;
}

const metrics: Metrics = {
  totalRequests: 0,
  byMethod: {},
  byStatusClass: {},
  errors: 0,
  totalResponseTimeMs: 0,
};

/** Lightweight in-process request metrics powering the `/api/metrics` endpoint. */
export function collectMetrics(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();
  metrics.totalRequests += 1;
  metrics.byMethod[req.method] = (metrics.byMethod[req.method] ?? 0) + 1;

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    metrics.totalResponseTimeMs += durationMs;
    const statusClass = `${Math.floor(res.statusCode / 100)}xx`;
    metrics.byStatusClass[statusClass] = (metrics.byStatusClass[statusClass] ?? 0) + 1;
    if (res.statusCode >= 500) metrics.errors += 1;
  });

  next();
}

export function getMetricsSnapshot() {
  const memory = process.memoryUsage();
  return {
    uptimeSeconds: Math.floor(process.uptime()),
    totalRequests: metrics.totalRequests,
    errors: metrics.errors,
    averageResponseTimeMs:
      metrics.totalRequests > 0
        ? Number((metrics.totalResponseTimeMs / metrics.totalRequests).toFixed(2))
        : 0,
    requestsByMethod: metrics.byMethod,
    requestsByStatusClass: metrics.byStatusClass,
    memory: {
      rssMb: Number((memory.rss / 1024 / 1024).toFixed(2)),
      heapUsedMb: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotalMb: Number((memory.heapTotal / 1024 / 1024).toFixed(2)),
    },
  };
}
