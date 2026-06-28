import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  GraduationCap,
  Boxes,
  Puzzle,
  Workflow,
  Chrome,
  Drama,
  BookOpen,
  ArrowRight,
  Settings2,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CountPill, NewBadge } from './nav-primitives';
import {
  buildPracticeTree,
  CHALLENGE_CATEGORIES,
  WORKFLOW_CATEGORIES,
  getModulesByCategory,
  isNewModule,
} from '@/config/navigation';
import { MODULES, searchModules, type ModuleMeta } from '@/config/modules';
import { searchLearningTracks, trackPath, type LearningTrack } from '@/config/learning';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLauncher } from '@/store/uiSlice';
import { toggleFavorite } from '@/store/prefsSlice';
import { cn } from '@/lib/utils';

interface LaunchItem {
  /** Present only for real modules (pinnable). */
  id?: string;
  label: string;
  to: string;
  icon: LucideIcon;
  count?: number;
  isNew?: boolean;
}
interface LaunchColumn {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  accent: string;
  items: LaunchItem[];
}

function baseColumns(): LaunchColumn[] {
  const practice = buildPracticeTree();
  const practiceItems: LaunchItem[] = practice.flatMap((node) =>
    node.categories.map((cat) => ({
      label: cat.category,
      to: `/category/${cat.slug}`,
      icon: cat.modules[0]?.icon ?? Boxes,
      count: cat.modules.length,
    })),
  );
  const toItem = (m: ModuleMeta): LaunchItem => ({ id: m.id, label: m.title, to: m.path, icon: m.icon, isNew: isNewModule(m.id) });
  const challengeItems = CHALLENGE_CATEGORIES.flatMap((c) => getModulesByCategory(c)).map(toItem);
  const workflowItems = WORKFLOW_CATEGORIES.flatMap((c) => getModulesByCategory(c)).map(toItem);

  return [
    {
      id: 'learn',
      label: 'Learn',
      icon: GraduationCap,
      to: '/learning',
      accent: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
      items: [
        { label: 'Selenium (Java)', to: '/learning#selenium', icon: Chrome },
        { label: 'Playwright (TS)', to: '/learning#playwright', icon: Drama },
        { label: 'Browse all courses', to: '/learning', icon: BookOpen },
      ],
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: Boxes,
      to: '/modules',
      accent: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
      items: practiceItems,
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: Puzzle,
      to: '/challenges',
      accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      items: challengeItems,
    },
    {
      id: 'workflows',
      label: 'Workflows',
      icon: Workflow,
      to: '/workflows',
      accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      items: workflowItems,
    },
  ];
}

/**
 * The bento app launcher — one overlay to reach anything in the lab. Opened from
 * either navbar or the dashboard. Pin modules (⭐) to add them to your nav.
 */
export function AppLauncher() {
  const open = useAppSelector((s) => s.ui.launcherOpen);
  const favorites = useAppSelector((s) => s.prefs.favorites);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [manage, setManage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const cols = useMemo(() => baseColumns(), []);

  useEffect(() => {
    if (open) {
      setQuery('');
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  const close = () => dispatch(setLauncher(false));
  const go = (to: string) => {
    close();
    navigate(to);
  };

  const pinnedColumn = useMemo<LaunchColumn | null>(() => {
    const items = favorites
      .map((id) => MODULES.find((m) => m.id === id))
      .filter(Boolean)
      .map((m) => ({ id: m!.id, label: m!.title, to: m!.path, icon: m!.icon })) as LaunchItem[];
    if (items.length === 0) return null;
    return { id: 'pinned', label: 'Pinned', icon: Star, to: '/explore', accent: 'text-primary bg-primary/10', items };
  }, [favorites]);

  const columns = pinnedColumn ? [pinnedColumn, ...cols] : cols;

  const q = query.trim();
  const results = useMemo(() => {
    if (!q) return null;
    return {
      modules: searchModules(q).slice(0, 18) as ModuleMeta[],
      tracks: searchLearningTracks(q).slice(0, 8) as LearningTrack[],
    };
  }, [q]);

  const renderItem = (item: LaunchItem) => {
    const isFav = item.id ? favorites.includes(item.id) : false;
    return (
      <div key={item.to + item.label} className="group/item flex items-center rounded-md transition-colors hover:bg-accent">
        <button
          type="button"
          onClick={() => go(item.to)}
          data-testid={item.id ? `launcher-item-${item.id}` : undefined}
          className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-1.5 text-left text-[13px] text-muted-foreground transition-colors group-hover/item:text-foreground"
        >
          <item.icon className="h-4 w-4 shrink-0 text-muted-foreground/80" aria-hidden="true" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.isNew ? <NewBadge /> : null}
          {item.count != null ? <CountPill>{item.count}</CountPill> : null}
        </button>
        {item.id ? (
          <button
            type="button"
            onClick={() => dispatch(toggleFavorite(item.id!))}
            aria-pressed={isFav}
            aria-label={isFav ? `Unpin ${item.label}` : `Pin ${item.label}`}
            className={cn(
              'mr-1 rounded p-1 text-muted-foreground/60 transition hover:text-primary',
              isFav || manage ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100',
            )}
          >
            <Star className={cn('h-3.5 w-3.5', isFav && 'fill-primary text-primary')} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => dispatch(setLauncher(v))}>
      <DialogContent className="max-h-[86vh] gap-0 overflow-hidden p-0 sm:max-w-5xl" data-testid="app-launcher">
        <DialogHeader className="sr-only">
          <DialogTitle>App launcher</DialogTitle>
          <DialogDescription>Search and open any module, course, challenge or workflow.</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center gap-2 border-b p-3 pr-12">
          <button
            type="button"
            onClick={() => go('/')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-primary transition-colors hover:bg-accent"
            aria-label="Go to home"
            data-testid="launcher-home"
          >
            <Home className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps or modules…"
              aria-label="Search apps or modules"
              data-testid="launcher-search"
              className="h-10 w-full rounded-lg border bg-muted/40 pl-9 pr-3 text-sm outline-none transition focus:border-primary/40 focus:bg-background"
            />
          </div>
          <button
            type="button"
            onClick={() => setManage((v) => !v)}
            aria-pressed={manage}
            data-testid="launcher-manage"
            className={cn(
              'hidden h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors sm:inline-flex',
              manage ? 'border-primary/40 bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Settings2 className="h-4 w-4" /> Customize
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {manage && !results ? (
            <p className="mb-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              <Star className="mr-1 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Tap the star on any module to pin it. Pinned modules appear in your top navigation and the Pinned group here.
            </p>
          ) : null}

          {results ? (
            results.modules.length === 0 && results.tracks.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No matches for “{q}”.</p>
            ) : (
              <div className="space-y-5">
                {results.tracks.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Courses</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {results.tracks.map((t) => (
                        <button key={t.id} type="button" onClick={() => go(trackPath(t.id))} className="flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:border-primary/30 hover:bg-accent">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <t.icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{t.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">{t.lessons.length} lessons</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {results.modules.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Modules</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {results.modules.map((m) => (
                        <button key={m.id} type="button" onClick={() => go(m.path)} data-testid={`launcher-result-${m.id}`} className="flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:border-primary/30 hover:bg-accent">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <m.icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{m.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">{m.category}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          ) : (
            <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {columns.map((col) => (
                <div key={col.id} data-testid={`launcher-col-${col.id}`}>
                  <Link to={col.to} onClick={close} className="group mb-2 flex items-center gap-2 border-b pb-2">
                    <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', col.accent)}>
                      <col.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-foreground">{col.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                  <div className="space-y-0.5">{col.items.map(renderItem)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
