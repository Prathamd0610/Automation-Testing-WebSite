import rateLimit from 'express-rate-limit';
import { isTest } from '../config/env';

const skip = () => isTest; // Disable limits during automated tests.

/** Generous limiter applied to the whole API surface. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Strict limiter for authentication endpoints to slow brute-force attempts. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { success: false, message: 'Too many authentication attempts, slow down.' },
});

/** Limiter for the write-heavy test-data generator. */
export const generatorLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { success: false, message: 'Too many generation requests.' },
});
