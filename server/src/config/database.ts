import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

mongoose.set('strictQuery', true);

let isConnected = false;

/**
 * Connect to MongoDB with bounded retries so a slow-starting database (common in
 * Docker Compose) does not crash the API on boot.
 */
export async function connectDatabase(retries = 5, delayMs = 3000): Promise<void> {
  if (isConnected) return;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        autoIndex: env.NODE_ENV !== 'production',
      });
      isConnected = true;
      logger.info('\u2705 MongoDB connected');
      return;
    } catch (error) {
      const remaining = retries - attempt;
      logger.error(
        `MongoDB connection failed (attempt ${attempt}/${retries}): ${(error as Error).message}`,
      );
      if (remaining === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB disconnected');
}

export function getConnectionState(): string {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] ?? 'unknown';
}
