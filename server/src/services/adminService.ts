import { Account, type AccountDocument, type AccountKey } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { Employee } from '../models/Employee';
import { AppError } from '../utils/AppError';

export interface AdminStats {
  users: { total: number; active: number; inactive: number; admins: number; recent: number };
  products: number;
  orders: number;
  customers: number;
  employees: number;
  accounts: { total: number; totalChecking: number; totalSavings: number };
}

export interface AdjustAccountInput {
  account: AccountKey;
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
}

class AdminService {
  /** Returns the user's account, creating an empty one on first access. */
  async getOrCreateAccount(userId: string): Promise<AccountDocument> {
    const existing = await Account.findOne({ user: userId });
    if (existing) return existing;
    return Account.create({ user: userId });
  }

  /** Aggregated counts for the admin dashboard. */
  async getStats(): Promise<AdminStats> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      adminUsers,
      recentUsers,
      products,
      orders,
      customers,
      employees,
      balances,
    ] = await Promise.all([
      User.estimatedDocumentCount(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Product.estimatedDocumentCount(),
      Order.estimatedDocumentCount(),
      Customer.estimatedDocumentCount(),
      Employee.estimatedDocumentCount(),
      Account.aggregate<{ totalChecking: number; totalSavings: number; total: number }>([
        {
          $group: {
            _id: null,
            totalChecking: { $sum: '$checking' },
            totalSavings: { $sum: '$savings' },
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const balance = balances[0] ?? { totalChecking: 0, totalSavings: 0, total: 0 };

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        admins: adminUsers,
        recent: recentUsers,
      },
      products,
      orders,
      customers,
      employees,
      accounts: {
        total: balance.total,
        totalChecking: balance.totalChecking,
        totalSavings: balance.totalSavings,
      },
    };
  }

  /**
   * Credits or debits a user's checking/savings account, records a transaction,
   * and returns the updated account. Debits cannot overdraw the balance.
   */
  async adjustAccount(
    userId: string,
    input: AdjustAccountInput,
    performedBy: string,
  ): Promise<{ account: AccountDocument; transaction: unknown }> {
    const account = await this.getOrCreateAccount(userId);

    const current = account[input.account];
    const delta = input.type === 'credit' ? input.amount : -input.amount;
    const next = current + delta;

    if (next < 0) {
      throw AppError.badRequest(
        `Insufficient ${input.account} balance: cannot debit ${input.amount} from ${current}`,
      );
    }

    account[input.account] = next;
    await account.save();

    const transaction = await Transaction.create({
      user: userId,
      account: input.account,
      type: input.type,
      amount: input.amount,
      balanceAfter: next,
      description: input.description ?? `Admin ${input.type} on ${input.account}`,
      performedBy,
    });

    return { account, transaction };
  }
}

export const adminService = new AdminService();
