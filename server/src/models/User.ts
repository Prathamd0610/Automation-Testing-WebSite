import { Schema, model, type HydratedDocument, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isActive: { type: Boolean, default: true },
    mfaEnabled: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    refreshTokenHash: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>).password;
        delete (ret as Record<string, unknown>).refreshTokenHash;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.method('comparePassword', function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
});

export const User = model<IUser, UserModel>('User', userSchema);
