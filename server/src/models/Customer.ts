import { Schema, model, type HydratedDocument } from 'mongoose';

export type CustomerStatus = 'active' | 'inactive' | 'lead';

export interface ICustomer {
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: CustomerStatus;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerDocument = HydratedDocument<ICustomer>;

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'lead'],
      default: 'lead',
      index: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true },
);

export const Customer = model<ICustomer>('Customer', customerSchema);
