import { randomUUID } from 'node:crypto';
import {
  productRepository,
  customerRepository,
  employeeRepository,
  orderRepository,
  userRepository,
  testDataRepository,
} from '../repositories';
import {
  buildFakeProduct,
  buildFakeCustomer,
  buildFakeEmployee,
  buildFakeOrder,
  buildFakeUser,
} from '../utils/fakerFactory';
import type { TestDataKind } from '../models/TestData';

export interface GenerationResult {
  kind: TestDataKind;
  requested: number;
  created: number;
  batchId: string;
}

const MAX_BATCH = 200;

class TestDataService {
  async generate(
    kind: TestDataKind,
    count: number,
    generatedBy?: string,
  ): Promise<GenerationResult> {
    const requested = Math.min(Math.max(1, count), MAX_BATCH);
    const batchId = randomUUID();
    let created = 0;

    switch (kind) {
      case 'users': {
        const docs = Array.from({ length: requested }, buildFakeUser);
        // Create individually so the password-hashing pre-save hook runs.
        await Promise.all(docs.map((doc) => userRepository.create(doc)));
        created = docs.length;
        break;
      }
      case 'products': {
        const docs = Array.from({ length: requested }, buildFakeProduct);
        await productRepository.insertMany(docs);
        created = docs.length;
        break;
      }
      case 'customers': {
        const docs = Array.from({ length: requested }, buildFakeCustomer);
        await customerRepository.insertMany(docs);
        created = docs.length;
        break;
      }
      case 'employees': {
        const docs = Array.from({ length: requested }, buildFakeEmployee);
        await employeeRepository.insertMany(docs);
        created = docs.length;
        break;
      }
      case 'orders': {
        const docs = Array.from({ length: requested }, buildFakeOrder);
        await orderRepository.insertMany(docs);
        created = docs.length;
        break;
      }
      default:
        created = 0;
    }

    await testDataRepository.create({
      kind,
      batchId,
      generatedBy,
      data: { requested, created },
    });

    return { kind, requested, created, batchId };
  }
}

export const testDataService = new TestDataService();
