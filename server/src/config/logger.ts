import winston from 'winston';
import { env, isProduction } from './env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return `${ts} [${level}]: ${stack || message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

/**
 * Centralized application logger. Console transport everywhere; structured JSON
 * in production so logs can be shipped to any aggregator.
 */
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: isProduction ? prodFormat : devFormat,
  defaultMeta: { service: 'automation-practice-api' },
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

/** Stream adapter so morgan can pipe HTTP logs through winston. */
export const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
