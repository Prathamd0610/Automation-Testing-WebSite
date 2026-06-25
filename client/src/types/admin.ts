import type { UserRole } from './api';

export interface AdminStats {
  users: { total: number; active: number; inactive: number; admins: number; recent: number };
  products: number;
  orders: number;
  customers: number;
  employees: number;
  accounts: { total: number; totalChecking: number; totalSavings: number };
}

export type AccountKey = 'checking' | 'savings';
export type TransactionType = 'credit' | 'debit' | 'adjustment';

/** A user reference as returned by populated admin endpoints. */
export interface UserRef {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface Account {
  id: string;
  user: string | UserRef;
  checking: number;
  savings: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  user: string | UserRef;
  account: AccountKey;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  performedBy?: string | UserRef;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  actor?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AdjustAccountPayload {
  account: AccountKey;
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
}

export interface BroadcastPayload {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
