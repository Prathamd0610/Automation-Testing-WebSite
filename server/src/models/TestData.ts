import { Schema, model, type HydratedDocument } from 'mongoose';

export type TestDataKind = 'users' | 'products' | 'orders' | 'employees' | 'customers';

export interface ITestData {
  kind: TestDataKind;
  data: Record<string, unknown>;
  batchId: string;
  generatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TestDataDocument = HydratedDocument<ITestData>;

const testDataSchema = new Schema<ITestData>(
  {
    kind: {
      type: String,
      enum: ['users', 'products', 'orders', 'employees', 'customers'],
      required: true,
      index: true,
    },
    data: { type: Schema.Types.Mixed, required: true },
    batchId: { type: String, required: true, index: true },
    generatedBy: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true },
);

export const TestData = model<ITestData>('TestData', testDataSchema);
