import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  X,
  ShieldCheck,
  Users,
  Wallet,
  Package,
  ScrollText,
  Megaphone,
} from 'lucide-react';
import { MODULE_CATEGORIES, getModulesByCategory } from '@/config/modules';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { setSidebar } from '@/store/uiSlice';
import { cn } from '@/lib/utils';

function NavItem({
  to,
  label,
  icon: Icon,
  testId,
  end,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  testId: string;
  end?: boolean;
}) {
  const dispatch = useAppDispatch();
  return (
    <NavLink
      to={to}
      end={end}
      data-testid={testId}
      onClick={() => dispatch(setSidebar(false))}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

const ADMIN_ITEMS = [
  { id: 'admin', to: '/admin', label: 'Dashboard', icon: ShieldCheck, end: true },
  { id: 'admin-users', to: '/admin/users', label: 'Users & Roles', icon: Users },
  { id: 'admin-accounts', to: '/admin/accounts', label: 'Accounts', icon: Wallet },
  { id: 'admin-products', to: '/admin/products', label: 'Products', icon: Package },
  { id: 'admin-audit', to: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  { id: 'admin-notifications', to: '/admin/notifications', label: 'Broadcast', icon: Megaphone },
];

export function Sidebar() {
  const open = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => dispatch(setSidebar(false))}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        aria-label="Module navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold" data-testid="sidebar-logo">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm">Automation Lab</span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
            onClick={() => dispatch(setSidebar(false))}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" data-testid="sidebar-nav">
          <div className="space-y-1">
            <NavItem to="/" label="Dashboard" icon={LayoutDashboard} testId="nav-dashboard" end />
          </div>

          {isAdmin ? (
            <div className="space-y-1" data-testid="sidebar-admin">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                Admin Panel
              </p>
              {ADMIN_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  testId={`nav-${item.id}`}
                  end={item.end}
                />
              ))}
            </div>
          ) : null}

          {MODULE_CATEGORIES.map((category) => {
            const modules = getModulesByCategory(category);
            if (modules.length === 0) return null;
            return (
              <div key={category} className="space-y-1">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {category}
                </p>
                {modules.map((module) => (
                  <NavItem
                    key={module.id}
                    to={module.path}
                    label={module.title}
                    icon={module.icon}
                    testId={`nav-${module.id}`}
                  />
                ))}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
