import { Schema, model, type HydratedDocument } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = HydratedDocument<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '', maxlength: 2000 },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true, maxlength: 3 },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Product = model<IProduct>('Product', productSchema);
