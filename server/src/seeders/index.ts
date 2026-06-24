import { faker } from '@faker-js/faker';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../config/logger';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { Employee } from '../models/Employee';
import { Order } from '../models/Order';
import { Task } from '../models/Task';
import { Notification } from '../models/Notification';
import {
  buildFakeProduct,
  buildFakeCustomer,
  buildFakeEmployee,
  buildFakeOrder,
} from '../utils/fakerFactory';

const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'] as const;

async function seed(): Promise<void> {
  await connectDatabase();
  logger.info('Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Employee.deleteMany({}),
    Order.deleteMany({}),
    Task.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // Deterministic accounts for documentation and e2e tests.
  await User.create({
    name: 'Platform Admin',
    email: 'admin@practice.dev',
    password: 'Admin123!',
    role: 'admin',
  });
  await User.create({
    name: 'Demo Tester',
    email: 'user@practice.dev',
    password: 'User1234!',
    role: 'user',
  });

  await Product.insertMany(Array.from({ length: 60 }, buildFakeProduct));
  await Customer.insertMany(Array.from({ length: 40 }, buildFakeCustomer));
  await Employee.insertMany(Array.from({ length: 40 }, buildFakeEmployee));
  await Order.insertMany(Array.from({ length: 50 }, buildFakeOrder));

  await Task.insertMany(
    Array.from({ length: 16 }, (_, index) => ({
      title: faker.hacker.phrase().slice(0, 80),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(TASK_STATUSES),
      priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
      assignee: faker.person.firstName(),
      order: index,
      tags: faker.helpers.arrayElements(['frontend', 'backend', 'qa', 'devops'], { min: 0, max: 2 }),
    })),
  );

  await Notification.insertMany(
    Array.from({ length: 12 }, () => ({
      title: faker.company.catchPhrase(),
      message: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error'] as const),
      read: faker.datatype.boolean(),
    })),
  );

  logger.info('\u2705 Seed complete');
  logger.info('   Admin: admin@practice.dev / Admin123!');
  logger.info('   User:  user@practice.dev / User1234!');

  await disconnectDatabase();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error(`Seed failed: ${(error as Error).message}`);
    process.exit(1);
  });
