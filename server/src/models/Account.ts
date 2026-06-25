import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type AccountKey = 'checking' | 'savings';

export interface IAccount {
  user: Types.ObjectId;
  checking: number;
  savings: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountDocument = HydratedDocument<IAccount>;

const accountSchema = new Schema<IAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    checking: { type: Number, default: 0, min: 0 },
    savings: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true, maxlength: 3 },
  },
  { timestamps: true },
);

export const Account = model<IAccount>('Account', accountSchema);
