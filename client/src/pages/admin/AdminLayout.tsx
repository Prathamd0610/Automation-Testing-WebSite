import { NavLink, Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';

const ADMIN_TABS = [
  { to: '/admin', label: 'Dashboard', testId: 'dashboard', end: true },
  { to: '/admin/users', label: 'Users & Roles', testId: 'users' },
  { to: '/admin/accounts', label: 'Accounts', testId: 'accounts' },
  { to: '/admin/products', label: 'Products', testId: 'products' },
  { to: '/admin/audit', label: 'Audit Log', testId: 'audit' },
  { to: '/admin/notifications', label: 'Broadcast', testId: 'notifications' },
];

/** Shell for the admin panel: header + sub-navigation + routed content. */
export default function AdminLayout() {
  return (
    <PageContainer>
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Admin Panel"
        description="Manage users, roles, account balances, products, and platform notifications."
      />

      <nav
        className="flex flex-wrap gap-1 rounded-lg border bg-card p-1"
        aria-label="Admin sections"
        data-testid="admin-tabs"
      >
        {ADMIN_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            data-testid={`admin-tab-${tab.testId}`}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </PageContainer>
  );
}
