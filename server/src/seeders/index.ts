import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../config/logger';
import { seedDatabase } from './seedData';

async function seed(): Promise<void> {
  await connectDatabase();
  await seedDatabase();
  await disconnectDatabase();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error(`Seed failed: ${(error as Error).message}`);
    process.exit(1);
  });
