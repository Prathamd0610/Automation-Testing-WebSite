// Ensure required environment variables exist before any module reads them.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test_access_secret_value_1234567890';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test_refresh_secret_value_1234567890';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/test';
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// Register the global `_id` -> `id` serializer before any model compiles.
import '../config/mongooseSerialization';

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  // Prefer an externally provided MongoDB when available (CI service container,
  // local Docker, etc.). This avoids the network download that
  // mongodb-memory-server performs on first run, which can be blocked in
  // restricted environments. Falls back to an in-memory server otherwise.
  const externalUri = process.env.MONGO_TEST_URI;
  if (externalUri) {
    await mongoose.connect(externalUri);
    return;
  }

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
});
