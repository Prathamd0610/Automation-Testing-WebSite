import { createServer } from 'node:http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './sockets/socketServer';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const httpServer = createServer(app);
  initializeSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    logger.info(`\ud83d\ude80 API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down gracefully...`);
    httpServer.close(async () => {
      await disconnectDatabase();
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force-exit if connections do not drain in time.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled rejection: ${reason}`);
  });
}

bootstrap().catch((error) => {
  logger.error(`Failed to start server: ${(error as Error).message}`);
  process.exit(1);
});
