import { NavLink, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Boxes, Puzzle, Workflow, ShieldCheck, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { toggleLauncher } from '@/store/uiSlice';
import { cn } from '@/lib/utils';

interface DockItem {
  to?: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  testId: string;
  match?: (path: string) => boolean;
}

const ITEMS: DockItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true, testId: 'nav-dashboard', match: (p) => p === '/' },
  { to: '/learning', label: 'Learn', icon: GraduationCap, testId: 'nav-learning', match: (p) => p.startsWith('/learning') },
  { to: '/modules', label: 'Practice', icon: Boxes, testId: 'nav-practice', match: (p) => p.startsWith('/modules') || p.startsWith('/category') },
  { to: '/challenges', label: 'Challenges', icon: Puzzle, testId: 'nav-challenges', match: (p) => p.startsWith('/challenges') },
  { to: '/workflows', label: 'Workflows', icon: Workflow, testId: 'nav-workflows', match: (p) => p.startsWith('/workflows') },
];

function DockTile({ active, label, testId, to, end, icon: Icon, onClick }: { active: boolean; label: string; testId: string; to?: string; end?: boolean; icon: LucideIcon; onClick?: () => void }) {
  const tileClass = cn(
    'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 group-hover:-translate-y-2',
    active
      ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
  );
  const body = <Icon className="h-6 w-6" aria-hidden="true" />;
  return (
    <div className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
      {to ? (
        <NavLink to={to} end={end} data-testid={testId} aria-label={label} className={tileClass}>
          {body}
        </NavLink>
      ) : (
        <button type="button" onClick={onClick} data-testid={testId} aria-label={label} className={tileClass}>
          {body}
        </button>
      )}
    </div>
  );
}

/**
 * Modern primary navigation — a floating, magnifying dock anchored to the
 * bottom of the viewport (macOS-dock feel). Deep navigation lives in the bento
 * launcher and command palette.
 */
export function CommandDock() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6" data-testid="command-dock">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-end gap-1.5 rounded-[26px] border border-border/60 bg-card/80 px-3 py-2 shadow-2xl shadow-black/10 backdrop-blur-2xl"
      >
        {ITEMS.map((item) => (
          <DockTile
            key={item.testId}
            active={item.match ? item.match(pathname) : false}
            label={item.label}
            testId={item.testId}
            to={item.to}
            end={item.end}
            icon={item.icon}
          />
        ))}
        {isAdmin ? (
          <DockTile active={pathname.startsWith('/admin')} label="Admin" testId="nav-admin" to="/admin" icon={ShieldCheck} />
        ) : null}

        <span className="mx-0.5 h-10 w-px self-center bg-border" aria-hidden="true" />

        <DockTile active={false} label="All apps" testId="open-launcher-dock" icon={LayoutGrid} onClick={() => dispatch(toggleLauncher())} />
      </nav>
    </div>
  );
}
