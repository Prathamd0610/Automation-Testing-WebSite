import { useState, type ReactNode } from 'react';
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
  MessageSquarePlus,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Boxes,
  BookOpen,
} from 'lucide-react';
import { MODULE_CATEGORIES, getModulesByCategory, categorySlug } from '@/config/modules';
import type { Difficulty } from '@/config/modules';
import { LEARNING_TRACKS, trackPath } from '@/config/learning';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { setSidebar } from '@/store/uiSlice';
import { UiModeToggle } from '@/components/common/UiModeToggle';
import { cn } from '@/lib/utils';

/** A small coloured dot indicating a learning track's difficulty. */
const LEVEL_DOT: Record<Difficulty, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  advanced: 'bg-rose-500',
};

/** Remember each collapsible group's open/closed state across navigations. */
function useCollapse(id: string, defaultOpen: boolean) {
  const [open, setOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(`atp_sidebar_${id}`);
      if (stored === 'open') return true;
      if (stored === 'closed') return false;
    } catch {
      /* ignore */
    }
    return defaultOpen;
  });

  const toggle = () =>
    setOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`atp_sidebar_${id}`, next ? 'open' : 'closed');
      } catch {
        /* ignore */
      }
      return next;
    });

  return [open, toggle] as const;
}

function NavItem({
  to,
  label,
  icon: Icon,
  testId,
  end,
  compact,
  trailing,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  testId: string;
  end?: boolean;
  compact?: boolean;
  trailing?: ReactNode;
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
          'flex items-center gap-2.5 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          compact ? 'px-2 py-1.5 text-[13px]' : 'px-3 py-2 text-sm',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <Icon className={cn('shrink-0', compact ? 'h-4 w-4 text-muted-foreground/80' : 'h-4 w-4')} aria-hidden="true" />
      <span className="flex-1 truncate">{label}</span>
      {trailing}
    </NavLink>
  );
}

/**
 * Top-level collapsible section (Admin / Learning / Practice) — the primary
 * "heading" level. A solid icon chip and bold label set it clearly apart from
 * the lighter category sub-headings nested inside it.
 */
function SectionGroup({
  id,
  label,
  icon: Icon,
  defaultOpen = true,
  testId,
  badge,
  children,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  testId?: string;
  badge?: ReactNode;
  children: React.ReactNode;
}) {
  const [open, toggle] = useCollapse(id, defaultOpen);
  return (
    <div data-testid={testId}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        data-testid={`group-${id}`}
        className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent/60"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
        {badge}
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open ? '' : '-rotate-90')}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="mb-1 mt-1 space-y-0.5 pl-2">{children}</div> : null}
    </div>
  );
}

/**
 * A practice category — the "sub-heading" level. Lighter, uppercase and
 * collapsible on its own, with its modules nested under a guide line.
 */
function CategoryGroup({ category }: { category: (typeof MODULE_CATEGORIES)[number] }) {
  const dispatch = useAppDispatch();
  const slug = categorySlug(category);
  const modules = getModulesByCategory(category);
  const [open, toggle] = useCollapse(`cat-${slug}`, false);

  if (modules.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${category}`}
          data-testid={`group-cat-${slug}`}
          className="rounded p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <ChevronRight
            className={cn('h-3.5 w-3.5 transition-transform', open ? 'rotate-90' : '')}
            aria-hidden="true"
          />
        </button>
        <NavLink
          to={`/category/${slug}`}
          data-testid={`nav-category-${slug}`}
          onClick={() => dispatch(setSidebar(false))}
          className={({ isActive }) =>
            cn(
              'flex flex-1 items-center justify-between gap-2 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground/80 hover:text-foreground',
            )
          }
        >
          <span className="truncate">{category}</span>
          <span className="shrink-0 rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            {modules.length}
          </span>
        </NavLink>
      </div>
      {open ? (
        <div className="ml-[15px] mt-0.5 space-y-0.5 border-l border-border/60 pl-2">
          {modules.map((module) => (
            <NavItem
              key={module.id}
              to={module.path}
              label={module.title}
              icon={module.icon}
              testId={`nav-${module.id}`}
              compact
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const ADMIN_ITEMS = [
  { id: 'admin', to: '/admin', label: 'Dashboard', icon: ShieldCheck, end: true },
  { id: 'admin-users', to: '/admin/users', label: 'Users & Roles', icon: Users },
  { id: 'admin-accounts', to: '/admin/accounts', label: 'Accounts', icon: Wallet },
  { id: 'admin-products', to: '/admin/products', label: 'Products', icon: Package },
  { id: 'admin-feedback', to: '/admin/feedback', label: 'Feedback', icon: MessageSquarePlus },
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

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" data-testid="sidebar-nav">
          {/* UI skin toggle (phones only — shown in the topbar on larger screens) */}
          <div className="flex items-center justify-between rounded-lg border px-3 py-2 sm:hidden">
            <span className="text-sm font-medium text-foreground">Interface</span>
            <UiModeToggle />
          </div>

          <div className="space-y-1">
            <NavItem to="/" label="Dashboard" icon={LayoutDashboard} testId="nav-dashboard" end />
          </div>

          {/* Admin Panel — pinned at the top, as usual. */}
          {isAdmin ? (
            <SectionGroup
              id="admin"
              label="Admin Panel"
              icon={ShieldCheck}
              defaultOpen
              testId="sidebar-admin"
            >
              {ADMIN_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  testId={`nav-${item.id}`}
                  end={item.end}
                  compact
                />
              ))}
            </SectionGroup>
          ) : null}

          {/* Learning Modules — browse course names freely; reading needs sign-in. */}
          <SectionGroup
            id="learning"
            label="Learning Modules"
            icon={GraduationCap}
            defaultOpen
            testId="sidebar-learning"
          >
            <NavItem
              to="/learning"
              label="All courses"
              icon={BookOpen}
              testId="nav-learning"
              end
              compact
            />
            {LEARNING_TRACKS.map((track) => (
              <NavItem
                key={track.id}
                to={trackPath(track.id)}
                label={track.title}
                icon={track.icon}
                testId={`nav-learning-${track.id}`}
                compact
                trailing={
                  <span
                    className={cn('h-2 w-2 shrink-0 rounded-full', LEVEL_DOT[track.level])}
                    title={track.level}
                    aria-hidden="true"
                  />
                }
              />
            ))}
          </SectionGroup>

          {/* Practice Modules — the hands-on sandbox, grouped by category. */}
          <SectionGroup
            id="practice"
            label="Practice Modules"
            icon={Boxes}
            defaultOpen
            testId="sidebar-practice"
          >
            {MODULE_CATEGORIES.map((category) => (
              <CategoryGroup key={category} category={category} />
            ))}
          </SectionGroup>
        </nav>
      </aside>
    </>
  );
}
