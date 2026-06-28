import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FlaskConical,
  Home,
  GraduationCap,
  Boxes,
  Puzzle,
  Workflow,
  ShieldCheck,
  LayoutGrid,
  ChevronRight,
  X,
  Chrome,
  Drama,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  buildLearningTree,
  buildPracticeTree,
  type LearningCategory,
} from '@/config/navigation';
import { trackPath } from '@/config/learning';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { toggleLauncher } from '@/store/uiSlice';
import { CountPill, LevelDot } from './nav-primitives';
import { cn } from '@/lib/utils';

type Panel = 'learn' | 'practice';
const TOOL_ICON: Record<LearningCategory, LucideIcon> = { Selenium: Chrome, Playwright: Drama };

interface RailItem {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  end?: boolean;
  panel?: Panel;
  testId: string;
}

const ITEMS: RailItem[] = [
  { id: 'home', label: 'Home', icon: Home, to: '/', end: true, testId: 'nav-dashboard' },
  { id: 'learn', label: 'Learn', icon: GraduationCap, panel: 'learn', to: '/learning', testId: 'nav-learning' },
  { id: 'practice', label: 'Practice', icon: Boxes, panel: 'practice', to: '/modules', testId: 'nav-practice' },
  { id: 'challenges', label: 'Challenges', icon: Puzzle, to: '/challenges', testId: 'nav-challenges' },
  { id: 'workflows', label: 'Workflows', icon: Workflow, to: '/workflows', testId: 'nav-workflows' },
];

function RailButton({
  item,
  active,
  onPanel,
}: {
  item: RailItem;
  active: boolean;
  onPanel: (p: Panel | null) => void;
}) {
  const Icon = item.icon;
  const inner = (
    <>
      <span
        className={cn(
          'absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all',
          active ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
          active
            ? 'bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-primary shadow-sm'
            : 'text-muted-foreground group-hover:bg-accent group-hover:text-foreground',
        )}
      >
        <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
      </span>
      <span className="text-[10px] font-medium leading-none text-muted-foreground group-hover:text-foreground">
        {item.label}
      </span>
    </>
  );

  if (item.panel) {
    return (
      <button
        type="button"
        data-testid={item.testId}
        onClick={() => onPanel(item.panel!)}
        aria-label={item.label}
        className="group relative flex w-full flex-col items-center gap-1 py-1"
      >
        {inner}
      </button>
    );
  }
  return (
    <NavLink
      to={item.to!}
      end={item.end}
      data-testid={item.testId}
      onClick={() => onPanel(null)}
      aria-label={item.label}
      className="group relative flex w-full flex-col items-center gap-1 py-1"
    >
      {inner}
    </NavLink>
  );
}

function LearnPanel({ onClose }: { onClose: () => void }) {
  const tree = buildLearningTree();
  return (
    <div className="space-y-4">
      <Link to="/learning" onClick={onClose} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-primary hover:bg-accent">
        <BookOpen className="h-4 w-4" /> All courses <ChevronRight className="ml-auto h-4 w-4" />
      </Link>
      {tree.map((tool) => {
        const ToolIcon = TOOL_ICON[tool.category];
        return (
          <div key={tool.category}>
            <div className="mb-1 flex items-center gap-2 px-2">
              <ToolIcon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{tool.category}</span>
              <CountPill>{tool.tracks.length}</CountPill>
            </div>
            <div className="space-y-0.5">
              {tool.tracks.map((t) => (
                <Link
                  key={t.id}
                  to={trackPath(t.id)}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LevelDot level={t.level} />
                  <span className="flex-1 truncate">{t.title}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PracticePanel({ onClose }: { onClose: () => void }) {
  const tree = buildPracticeTree();
  return (
    <div className="space-y-4">
      <Link to="/modules" onClick={onClose} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-primary hover:bg-accent">
        <Boxes className="h-4 w-4" /> All modules <ChevronRight className="ml-auto h-4 w-4" />
      </Link>
      {tree.map((node) => {
        const DomainIcon = node.domain.icon;
        return (
          <div key={node.domain.id}>
            <div className="mb-1 flex items-center gap-2 px-2">
              <DomainIcon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{node.domain.label}</span>
            </div>
            <div className="space-y-0.5">
              {node.categories.map((cat) => {
                const CatIcon = cat.modules[0]?.icon ?? Boxes;
                return (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <CatIcon className="h-4 w-4 text-muted-foreground/80" aria-hidden="true" />
                    <span className="flex-1 truncate">{cat.category}</span>
                    <CountPill>{cat.modules.length}</CountPill>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RailNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const isAdmin = user?.role === 'admin';
  const [panel, setPanel] = useState<Panel | null>(null);

  const items = isAdmin
    ? [...ITEMS, { id: 'admin', label: 'Admin', icon: ShieldCheck, to: '/admin', testId: 'nav-admin' } as RailItem]
    : ITEMS;

  const isItemActive = (item: RailItem) => {
    if (item.end) return pathname === item.to;
    if (item.id === 'learn') return pathname.startsWith('/learning');
    if (item.id === 'practice') return pathname.startsWith('/modules') || pathname.startsWith('/category');
    return item.to ? pathname.startsWith(item.to) : false;
  };

  return (
    <>
      <aside
        id="app-sidebar"
        aria-label="Primary navigation"
        className="z-40 hidden w-[76px] shrink-0 flex-col items-center border-r bg-card/60 py-3 backdrop-blur lg:flex"
        data-testid="rail-nav"
      >
        <Link to="/" data-testid="sidebar-logo" aria-label="Home" className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
          <FlaskConical className="h-6 w-6" aria-hidden="true" />
        </Link>

        <nav className="flex flex-1 flex-col items-stretch gap-1">
          {items.map((item) => (
            <RailButton key={item.id} item={item} active={isItemActive(item)} onPanel={setPanel} />
          ))}
        </nav>

        <button
          type="button"
          onClick={() => dispatch(toggleLauncher())}
          data-testid="open-launcher-rail"
          aria-label="App launcher"
          className="group mt-2 flex w-full flex-col items-center gap-1 py-1"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-accent group-hover:text-primary">
            <LayoutGrid className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <span className="text-[10px] font-medium leading-none text-muted-foreground group-hover:text-foreground">Apps</span>
        </button>
      </aside>

      {/* Flyout panel */}
      <AnimatePresence>
        {panel ? (
          <>
            <div className="fixed inset-0 z-30 hidden lg:block" onClick={() => setPanel(null)} aria-hidden="true" />
            <motion.div
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -16, opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="fixed bottom-0 left-[76px] top-0 z-40 hidden w-72 flex-col border-r bg-card shadow-2xl lg:flex"
              data-testid={`rail-panel-${panel}`}
            >
              <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-sm font-semibold text-foreground">{panel === 'learn' ? 'Learn' : 'Practice'}</span>
                <button type="button" onClick={() => setPanel(null)} aria-label="Close panel" className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {panel === 'learn' ? <LearnPanel onClose={() => setPanel(null)} /> : <PracticePanel onClose={() => setPanel(null)} />}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
