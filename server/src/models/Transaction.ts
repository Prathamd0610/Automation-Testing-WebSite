import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import type { AccountKey } from './Account';

export type TransactionType = 'credit' | 'debit' | 'adjustment';

export interface ITransaction {
  user: Types.ObjectId;
  account: AccountKey;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  performedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionDocument = HydratedDocument<ITransaction>;

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    account: { type: String, enum: ['checking', 'savings'], required: true },
    type: { type: String, enum: ['credit', 'debit', 'adjustment'], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String, default: '', maxlength: 200 },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

transactionSchema.index({ user: 1, createdAt: -1 });

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
