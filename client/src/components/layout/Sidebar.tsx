import { useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FlaskConical,
  X,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  BookOpen,
  ShieldCheck,
  Users,
  Wallet,
  Package,
  ScrollText,
  Megaphone,
  MessageSquarePlus,
  Chrome,
  Drama,
  CornerDownRight,
  Puzzle,
  Workflow,
} from 'lucide-react';
import {
  PRIMARY_DESTINATIONS,
  buildPracticeTree,
  buildLearningTree,
  CHALLENGE_CATEGORIES,
  WORKFLOW_CATEGORIES,
  isNewModule,
  DIFFICULTY_META,
  type LearningCategory,
} from '@/config/navigation';
import {
  MODULES,
  getModulesByCategory,
  searchModules,
  type ModuleMeta,
} from '@/config/modules';
import { trackPath, searchLearningTracks, type LearningTrack } from '@/config/learning';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { useTrackProgress } from '@/hooks/useProgress';
import { setSidebar, toggleSidebarCollapsed } from '@/store/uiSlice';
import { toggleFavorite } from '@/store/prefsSlice';
import { UiModeToggle } from '@/components/common/UiModeToggle';
import { ProgressRing } from '@/components/common/ProgressRing';
import { LevelDot, NewBadge, CountPill } from './nav-primitives';
import { cn } from '@/lib/utils';

const TOOL_ICON: Record<LearningCategory, typeof Chrome> = {
  Selenium: Chrome,
  Playwright: Drama,
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

/* ── Leaf rows ──────────────────────────────────────────────────────────── */

function Row({
  to,
  label,
  icon: Icon,
  testId,
  end,
  indent = 0,
  trailing,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  testId: string;
  end?: boolean;
  indent?: number;
  trailing?: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      data-testid={testId}
      onClick={onNavigate}
      style={indent ? { paddingLeft: 8 + indent * 14 } : undefined}
      className={({ isActive }) =>
        cn(
          'group/row flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground/80" aria-hidden="true" />
      <span className="flex-1 truncate">{label}</span>
      {trailing}
    </NavLink>
  );
}

function ModuleRow({ module, onNavigate }: { module: ModuleMeta; onNavigate: () => void }) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((s) => s.prefs.favorites.includes(module.id));
  const isDone = useAppSelector((s) => s.progress.modules.includes(module.id));
  return (
    <Row
      to={module.path}
      label={module.title}
      icon={module.icon}
      testId={`nav-${module.id}`}
      onNavigate={onNavigate}
      trailing={
        <span className="flex items-center gap-1">
          {isDone ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Completed" /> : null}
          {isNewModule(module.id) ? <NewBadge /> : null}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(toggleFavorite(module.id));
            }}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Unpin ${module.title}` : `Pin ${module.title}`}
            className={cn(
              'rounded p-0.5 text-muted-foreground/50 transition hover:text-primary',
              isFavorite ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100',
            )}
          >
            <Star className={cn('h-3.5 w-3.5', isFavorite && 'fill-primary text-primary')} aria-hidden="true" />
          </button>
        </span>
      }
    />
  );
}

function TrackRow({ track, onNavigate }: { track: LearningTrack; onNavigate: () => void }) {
  const { pct } = useTrackProgress(track);
  return (
    <Row
      to={trackPath(track.id)}
      label={track.title}
      icon={track.icon}
      testId={`nav-learning-${track.id}`}
      onNavigate={onNavigate}
      trailing={
        <span className="flex items-center gap-1.5">
          {pct > 0 ? <ProgressRing value={pct} size={16} strokeWidth={2.5} /> : null}
          <LevelDot level={track.level} />
        </span>
      }
    />
  );
}

/* ── Group shells ──────────────────────────────────────────────────────── */

function Section({
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
  children: ReactNode;
}) {
  const [open, toggle] = useCollapse(id, defaultOpen);
  return (
    <div data-testid={testId}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        data-testid={`group-${id}`}
        className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent/60"
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
      {open ? <div className="mb-1 mt-0.5 space-y-0.5 pl-1">{children}</div> : null}
    </div>
  );
}

function SubGroup({
  id,
  label,
  to,
  count,
  icon: Icon,
  testId,
  defaultOpen = false,
  onNavigate,
  children,
}: {
  id: string;
  label: string;
  to?: string;
  count?: number;
  icon?: React.ElementType;
  testId?: string;
  defaultOpen?: boolean;
  onNavigate: () => void;
  children: ReactNode;
}) {
  const [open, toggle] = useCollapse(id, defaultOpen);
  return (
    <div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
          data-testid={testId}
          className="rounded p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-90')} aria-hidden="true" />
        </button>
        {to ? (
          <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground/80 hover:text-foreground',
              )
            }
          >
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            <span className="flex-1 truncate">{label}</span>
            {count != null ? <CountPill>{count}</CountPill> : null}
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="flex flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            <span className="flex-1 truncate text-left">{label}</span>
            {count != null ? <CountPill>{count}</CountPill> : null}
          </button>
        )}
      </div>
      {open ? <div className="ml-[14px] mt-0.5 space-y-0.5 border-l border-border/60 pl-1.5">{children}</div> : null}
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

/* ── Collapsed icon rail (desktop only) ────────────────────────────────── */

function RailContent({ isAdmin, onExpand }: { isAdmin: boolean; onExpand: () => void }) {
  const dests = PRIMARY_DESTINATIONS.filter((d) => !d.adminOnly || isAdmin);
  return (
    <div className="hidden h-full w-full flex-col items-center py-3 lg:flex" data-testid="sidebar-rail">
      <Link
        to="/"
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        data-testid="sidebar-logo-rail"
        aria-label="Home"
      >
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-1" aria-label="Primary">
        {dests.map((d) => (
          <NavLink
            key={d.id}
            to={d.to}
            end={d.end}
            data-testid={`${d.testId}-rail`}
            title={d.label}
            className={({ isActive }) =>
              cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <d.icon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{d.label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={onExpand}
        className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Expand sidebar"
        data-testid="sidebar-expand"
      >
        <PanelLeftOpen className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ── Main sidebar ──────────────────────────────────────────────────────── */

export function Sidebar() {
  const open = useAppSelector((state) => state.ui.sidebarOpen);
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const favorites = useAppSelector((state) => state.prefs.favorites);
  const recents = useAppSelector((state) => state.prefs.recents);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [query, setQuery] = useState('');
  const close = () => dispatch(setSidebar(false));

  const practiceTree = useMemo(() => buildPracticeTree(), []);
  const learningTree = useMemo(() => buildLearningTree(), []);

  const byId = useMemo(() => new Map(MODULES.map((m) => [m.id, m] as const)), []);
  const pinned = favorites.map((id) => byId.get(id)).filter(Boolean) as ModuleMeta[];
  const recent = recents.map((id) => byId.get(id)).filter(Boolean) as ModuleMeta[];

  const q = query.trim();
  const searchResults = useMemo(() => {
    if (!q) return null;
    return { modules: searchModules(q).slice(0, 12), tracks: searchLearningTracks(q).slice(0, 6) };
  }, [q]);

  const learningCount = learningTree.reduce((s, t) => s + t.tracks.length, 0);
  const practiceCount = practiceTree.reduce((s, d) => s + d.moduleCount, 0);
  const challengeCount = CHALLENGE_CATEGORIES.reduce((s, c) => s + getModulesByCategory(c).length, 0);
  const workflowCount = WORKFLOW_CATEGORIES.reduce((s, c) => s + getModulesByCategory(c).length, 0);

  // Collapsed shows a slim icon rail on desktop; mobile always uses the full drawer.
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        aria-label="Module navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card transition-[transform,width] duration-200 lg:static lg:translate-x-0',
          collapsed ? 'lg:w-16' : 'lg:w-72',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Desktop collapsed rail */}
        {collapsed ? (
          <RailContent isAdmin={isAdmin} onExpand={() => dispatch(toggleSidebarCollapsed())} />
        ) : null}

        {/* Full content — always on mobile; on desktop only when expanded */}
        <div className={cn('flex h-full min-h-0 flex-1 flex-col', collapsed && 'lg:hidden')}>
          <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold" data-testid="sidebar-logo">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm">Automation Lab</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:block"
              onClick={() => dispatch(toggleSidebarCollapsed())}
              aria-label="Collapse sidebar"
              data-testid="sidebar-collapse"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
              onClick={close}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search / filter */}
        <div className="border-b px-3 py-2.5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter navigation…"
              aria-label="Filter navigation"
              data-testid="sidebar-filter"
              className="h-8 w-full rounded-md border bg-muted/40 pl-8 pr-2 text-[13px] outline-none transition focus:border-primary/40 focus:bg-background"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3" data-testid="sidebar-nav">
          {/* UI skin toggle (phones only) */}
          <div className="flex items-center justify-between rounded-lg border px-3 py-2 sm:hidden">
            <span className="text-sm font-medium text-foreground">Interface</span>
            <UiModeToggle />
          </div>

          {searchResults ? (
            <div className="space-y-1" data-testid="sidebar-search-results">
              {searchResults.tracks.length === 0 && searchResults.modules.length === 0 ? (
                <p className="px-2 py-6 text-center text-[13px] text-muted-foreground">No matches for “{q}”.</p>
              ) : null}
              {searchResults.tracks.length > 0 ? (
                <>
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Courses
                  </p>
                  {searchResults.tracks.map((t) => (
                    <TrackRow key={t.id} track={t} onNavigate={close} />
                  ))}
                </>
              ) : null}
              {searchResults.modules.length > 0 ? (
                <>
                  <p className="mt-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Modules
                  </p>
                  {searchResults.modules.map((m) => (
                    <ModuleRow key={m.id} module={m} onNavigate={close} />
                  ))}
                </>
              ) : null}
            </div>
          ) : (
            <>
              {/* Primary destinations */}
              <div className="space-y-0.5">
                {PRIMARY_DESTINATIONS.filter((d) => d.id === 'home' || d.id === 'explore').map((d) => (
                  <Row
                    key={d.id}
                    to={d.to}
                    label={d.label}
                    icon={d.icon}
                    testId={d.testId}
                    end={d.end}
                    onNavigate={close}
                  />
                ))}
              </div>

              {/* Pinned */}
              {pinned.length > 0 ? (
                <Section
                  id="pinned"
                  label="Pinned"
                  icon={Star}
                  defaultOpen
                  testId="sidebar-pinned"
                  badge={<CountPill>{pinned.length}</CountPill>}
                >
                  {pinned.map((m) => (
                    <ModuleRow key={m.id} module={m} onNavigate={close} />
                  ))}
                </Section>
              ) : null}

              {/* Recent */}
              {recent.length > 0 ? (
                <Section id="recent" label="Recent" icon={Clock} defaultOpen={false} testId="sidebar-recent">
                  {recent.slice(0, 6).map((m) => (
                    <ModuleRow key={m.id} module={m} onNavigate={close} />
                  ))}
                </Section>
              ) : null}

              {/* Admin */}
              {isAdmin ? (
                <Section id="admin" label="Admin Panel" icon={ShieldCheck} defaultOpen testId="sidebar-admin">
                  {ADMIN_ITEMS.map((item) => (
                    <Row
                      key={item.id}
                      to={item.to}
                      label={item.label}
                      icon={item.icon}
                      testId={`nav-${item.id}`}
                      end={item.end}
                      onNavigate={close}
                    />
                  ))}
                </Section>
              ) : null}

              {/* Learn → tool → level → track */}
              <Section
                id="learning"
                label="Learn"
                icon={BookOpen}
                defaultOpen
                testId="sidebar-learning"
                badge={<CountPill>{learningCount}</CountPill>}
              >
                <Row to="/learning" label="All courses" icon={BookOpen} testId="nav-learning" end onNavigate={close} />
                {learningTree.map((tool) => {
                  const ToolIcon = TOOL_ICON[tool.category];
                  return (
                    <SubGroup
                      key={tool.category}
                      id={`learn-${tool.category.toLowerCase()}`}
                      label={tool.category}
                      to={`/learning#${tool.category.toLowerCase()}`}
                      count={tool.tracks.length}
                      icon={ToolIcon}
                      testId={`group-learn-${tool.category.toLowerCase()}`}
                      defaultOpen
                      onNavigate={close}
                    >
                      {tool.levels.map((band) => (
                        <SubGroup
                          key={band.level}
                          id={`learn-${tool.category.toLowerCase()}-${band.level}`}
                          label={DIFFICULTY_META[band.level].label}
                          count={band.tracks.length}
                          defaultOpen
                          onNavigate={close}
                        >
                          {band.tracks.map((t) => (
                            <TrackRow key={t.id} track={t} onNavigate={close} />
                          ))}
                        </SubGroup>
                      ))}
                    </SubGroup>
                  );
                })}
              </Section>

              {/* Practice → domain → category → module */}
              <Section
                id="practice"
                label="Practice"
                icon={CornerDownRight}
                defaultOpen
                testId="sidebar-practice"
                badge={<CountPill>{practiceCount}</CountPill>}
              >
                {practiceTree.map((node) => (
                  <SubGroup
                    key={node.domain.id}
                    id={`domain-${node.domain.id}`}
                    label={node.domain.label}
                    count={node.moduleCount}
                    testId={`group-domain-${node.domain.id}`}
                    defaultOpen
                    onNavigate={close}
                  >
                    {node.categories.map((cat) => (
                      <SubGroup
                        key={cat.slug}
                        id={`cat-${cat.slug}`}
                        label={cat.category}
                        to={`/category/${cat.slug}`}
                        count={cat.modules.length}
                        testId={`group-cat-${cat.slug}`}
                        defaultOpen={false}
                        onNavigate={close}
                      >
                        {cat.modules.map((m) => (
                          <ModuleRow key={m.id} module={m} onNavigate={close} />
                        ))}
                      </SubGroup>
                    ))}
                  </SubGroup>
                ))}
              </Section>

              {/* Challenges */}
              <Section
                id="challenges"
                label="Challenges"
                icon={Puzzle}
                defaultOpen={false}
                testId="sidebar-challenges"
                badge={<CountPill>{challengeCount}</CountPill>}
              >
                {CHALLENGE_CATEGORIES.map((c) => (
                  <div key={c} className="space-y-0.5">
                    {getModulesByCategory(c).map((m) => (
                      <ModuleRow key={m.id} module={m} onNavigate={close} />
                    ))}
                  </div>
                ))}
              </Section>

              {/* Workflows */}
              <Section
                id="workflows"
                label="Workflows"
                icon={Workflow}
                defaultOpen={false}
                testId="sidebar-workflows"
                badge={<CountPill>{workflowCount}</CountPill>}
              >
                {WORKFLOW_CATEGORIES.map((c) => (
                  <div key={c} className="space-y-0.5">
                    {getModulesByCategory(c).map((m) => (
                      <ModuleRow key={m.id} module={m} onNavigate={close} />
                    ))}
                  </div>
                ))}
              </Section>
            </>
          )}
        </nav>
        </div>
      </aside>
    </>
  );
}
