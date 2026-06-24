import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
// Side-effect import: registers the global Mongoose `_id` -> `id` serializer
// before any model is compiled by the route graph below.
import './config/mongooseSerialization';
import { env, isProduction } from './config/env';
import { morganStream } from './config/logger';
import { sanitizeBody } from './middleware/sanitize';
import { collectMetrics } from './middleware/requestMetrics';
import { globalLimiter } from './middleware/rateLimiters';
import { notFound, errorHandler } from './middleware/errorHandler';
import { UPLOAD_DIR } from './middleware/upload';
import apiRouter from './routes';

/** Strip a single trailing slash so `https://x.app/` and `https://x.app` match. */
function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

// Allowed browser origins, parsed from FRONTEND_URL (single value or comma-separated list).
const allowedOrigins = env.FRONTEND_URL.split(',').map(normalizeOrigin).filter(Boolean);

/**
 * CORS origin check that tolerates trailing-slash differences, supports multiple
 * configured origins, and allows Vercel preview deployments (`*.vercel.app`).
 * Requests without an `Origin` header (curl, health checks, server-to-server)
 * are allowed through.
 */
function corsOrigin(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
): void {
  if (!origin) return callback(null, true);
  const normalized = normalizeOrigin(origin);

  let isVercelPreview = false;
  try {
    isVercelPreview = new URL(normalized).hostname.endsWith('.vercel.app');
  } catch {
    isVercelPreview = false;
  }

  const isAllowed = allowedOrigins.includes(normalized) || isVercelPreview;
  return callback(null, isAllowed);
}

export function createApp(): Application {
  const app = express();

  // Behind Nginx/load balancers; required for correct client IPs + rate limiting.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Security headers. Allow cross-origin loading of uploaded assets.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Injection / pollution / XSS hardening.
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(sanitizeBody);

  // Observability.
  app.use(morgan(isProduction ? 'combined' : 'dev', { stream: morganStream }));
  app.use(collectMetrics);

  // Throttle the whole API surface.
  app.use('/api', globalLimiter);

  // Static uploads for the file-upload practice module.
  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '1d' }));

  // API routes.
  app.use('/api', apiRouter);

  // Root ping.
  app.get('/', (_req, res) => {
    res.json({ success: true, message: 'Automation Testing Practice Platform API', docs: '/api/health' });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
