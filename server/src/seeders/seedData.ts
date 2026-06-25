import { faker } from '@faker-js/faker';
import { logger } from '../config/logger';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
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

/** Deterministic demo accounts used in docs, e2e tests, and manual login. */
const DEMO_ACCOUNTS = [
  { name: 'Platform Admin', email: 'admin@practice.dev', password: 'Admin123!', role: 'admin' as const },
  { name: 'Demo Tester', email: 'user@practice.dev', password: 'User1234!', role: 'user' as const },
];

/** Inserts the fake demo records (non-destructive — does not clear collections). */
async function insertDemoData(): Promise<void> {
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
}

/** Demo starting balances per account email. */
const DEMO_BALANCES: Record<string, { checking: number; savings: number }> = {
  'admin@practice.dev': { checking: 12_000, savings: 48_000 },
  'user@practice.dev': { checking: 5_200.75, savings: 18_230.4 },
};

/** Creates any demo account that does not already exist (idempotent). */
async function ensureDemoAccounts(): Promise<void> {
  for (const account of DEMO_ACCOUNTS) {
    let user = await User.findOne({ email: account.email });
    if (!user) {
      // User.create triggers the password-hashing pre-save hook.
      user = await User.create(account);
      logger.info(`Created demo account: ${account.email}`);
    }
    const hasBank = await Account.findOne({ user: user.id });
    if (!hasBank) {
      const balances = DEMO_BALANCES[account.email] ?? { checking: 0, savings: 0 };
      await Account.create({ user: user.id, ...balances });
    }
  }
}

/**
 * Populates the database with the deterministic demo accounts and fake records.
 * Assumes an active Mongoose connection — connection lifecycle is the caller's
 * responsibility. Destructive: clears the collections it seeds first.
 */
export async function seedDatabase(): Promise<void> {
  logger.info('Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Account.deleteMany({}),
    Transaction.deleteMany({}),
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Employee.deleteMany({}),
    Order.deleteMany({}),
    Task.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  await ensureDemoAccounts();
  await insertDemoData();

  logger.info('\u2705 Seed complete');
  logger.info('   Admin: admin@practice.dev / Admin123!');
  logger.info('   User:  user@practice.dev / User1234!');
}

/**
 * Non-destructive startup seed. Always guarantees the demo accounts exist (so
 * admin login works even if the DB already has user-registered accounts), and
 * seeds the demo data set once when no demo records are present yet.
 * Opt out entirely with AUTO_SEED=false.
 */
export async function ensureSeeded(): Promise<void> {
  if (process.env.AUTO_SEED === 'false') return;

  await ensureDemoAccounts();

  const productCount = await Product.estimatedDocumentCount();
  if (productCount === 0) {
    logger.info('No demo data found \u2014 seeding demo records...');
    await insertDemoData();
  }
}

