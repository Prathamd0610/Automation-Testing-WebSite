import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Package,
  ShoppingCart,
  Contact,
  Briefcase,
  Wallet,
  PiggyBank,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/common/PageContainer';
import { Spinner } from '@/components/ui/spinner';
import { adminApi } from '@/services/adminApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import type { AdminStats } from '@/types/admin';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  testId: string;
}

function StatCard({ label, value, icon: Icon, testId }: StatCardProps) {
  return (
    <Card data-testid={testId}>
      <CardContent className="flex items-center gap-4 pt-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function money(value: number): string {
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) toast.error(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center py-12" data-testid="admin-stats-loading">
        <Spinner label="Loading stats" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Section title="Users">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total users" value={stats.users.total} icon={Users} testId="stat-users-total" />
          <StatCard label="Active" value={stats.users.active} icon={UserCheck} testId="stat-users-active" />
          <StatCard label="Inactive" value={stats.users.inactive} icon={Users} testId="stat-users-inactive" />
          <StatCard label="Admins" value={stats.users.admins} icon={ShieldCheck} testId="stat-users-admins" />
          <StatCard label="New (7 days)" value={stats.users.recent} icon={UserPlus} testId="stat-users-recent" />
        </div>
      </Section>

      <Section title="Catalog & business">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Products" value={stats.products} icon={Package} testId="stat-products" />
          <StatCard label="Orders" value={stats.orders} icon={ShoppingCart} testId="stat-orders" />
          <StatCard label="Customers" value={stats.customers} icon={Contact} testId="stat-customers" />
          <StatCard label="Employees" value={stats.employees} icon={Briefcase} testId="stat-employees" />
        </div>
      </Section>

      <Section title="Accounts">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Accounts" value={stats.accounts.total} icon={Wallet} testId="stat-accounts" />
          <StatCard
            label="Total checking"
            value={money(stats.accounts.totalChecking)}
            icon={Wallet}
            testId="stat-checking"
          />
          <StatCard
            label="Total savings"
            value={money(stats.accounts.totalSavings)}
            icon={PiggyBank}
            testId="stat-savings"
          />
        </div>
      </Section>
    </div>
  );
}
