import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Star, GraduationCap, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MODULES, MODULE_CATEGORIES, searchModules } from '@/config/modules';
import { LEARNING_TRACKS, trackPath, lessonPath } from '@/config/learning';
import { PRIMARY_DESTINATIONS, PRACTICE_DOMAINS, categorySlug } from '@/config/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/prefsSlice';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Entry {
  kind: 'module' | 'category' | 'learning' | 'nav';
  id: string;
  title: string;
  description: string;
  meta: string;
  path: string;
  Icon: LucideIcon;
}

interface Group {
  header?: string;
  headerIcon?: LucideIcon;
  items: Entry[];
}

/** Bold the part of `text` that matches `q`. */
function highlight(text: string, q: string): ReactNode {
  const needle = q.trim().toLowerCase();
  if (!needle) return text;
  const i = text.toLowerCase().indexOf(needle);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-semibold text-primary">{text.slice(i, i + needle.length)}</span>
      {text.slice(i + needle.length)}
    </>
  );
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const isModern = useAppSelector((s) => s.ui.uiMode === 'modern');
  const recentIds = useAppSelector((s) => s.prefs.recents);
  const favoriteIds = useAppSelector((s) => s.prefs.favorites);

  const listRef = useRef<HTMLUListElement>(null);

  const groups = useMemo<Group[]>(() => {
    const q = query.trim();
    const toModuleEntry = (m: (typeof MODULES)[number]): Entry => ({
      kind: 'module',
      id: m.id,
      title: m.title,
      description: m.description,
      meta: m.category,
      path: m.path,
      Icon: m.icon,
    });

    const source = q ? searchModules(q) : MODULES;
    const result: Group[] = [];

    // When idle, surface recently-viewed modules first for quick re-entry.
    if (!q) {
      const byId = new Map(MODULES.map((m) => [m.id, m] as const));
      const recents = recentIds.map((id) => byId.get(id)).filter(Boolean) as typeof MODULES;
      if (recents.length > 0) {
        result.push({
          header: 'Recently viewed',
          headerIcon: Clock,
          items: recents.slice(0, 4).map(toModuleEntry),
        });
      }
    }

    // Learning courses and lessons. Tracks always show; lessons only when searching.
    const needle = q.toLowerCase();
    const learningItems: Entry[] = [];
    for (const track of LEARNING_TRACKS) {
      const trackMatch =
        !needle ||
        track.title.toLowerCase().includes(needle) ||
        track.description.toLowerCase().includes(needle) ||
        track.tags.some((t) => t.includes(needle));
      if (trackMatch) {
        learningItems.push({
          kind: 'learning',
          id: `track-${track.id}`,
          title: track.title,
          description: track.subtitle,
          meta: 'Course',
          path: trackPath(track.id),
          Icon: track.icon,
        });
      }
      if (needle) {
        for (const lesson of track.lessons) {
          if (
            lesson.title.toLowerCase().includes(needle) ||
            lesson.summary.toLowerCase().includes(needle)
          ) {
            learningItems.push({
              kind: 'learning',
              id: `lesson-${track.id}-${lesson.id}`,
              title: lesson.title,
              description: `${track.title} · lesson`,
              meta: 'Lesson',
              path: lessonPath(track.id, lesson.id),
              Icon: track.icon,
            });
          }
        }
      }
    }
    if (learningItems.length > 0) {
      result.push({ header: 'Learning', headerIcon: GraduationCap, items: learningItems });
    }

    // Every activity, segregated by its category.
    for (const category of MODULE_CATEGORIES) {
      const items = source.filter((m) => m.category === category).map(toModuleEntry);
      if (items.length > 0) result.push({ header: category, items });
    }

    // Quick navigation to top-level destinations and practice domains.
    const navItems: Entry[] = [];
    for (const d of PRIMARY_DESTINATIONS) {
      if (d.adminOnly) continue;
      if (!needle || d.label.toLowerCase().includes(needle) || d.description.toLowerCase().includes(needle)) {
        navItems.push({
          kind: 'nav',
          id: `go-${d.id}`,
          title: d.label,
          description: d.description,
          meta: 'Go to',
          path: d.to,
          Icon: d.icon,
        });
      }
    }
    for (const domain of PRACTICE_DOMAINS) {
      if (!needle || domain.label.toLowerCase().includes(needle) || domain.tagline.toLowerCase().includes(needle)) {
        navItems.push({
          kind: 'nav',
          id: `go-domain-${domain.id}`,
          title: domain.label,
          description: domain.tagline,
          meta: 'Domain',
          path: `/category/${categorySlug(domain.categories[0]!)}`,
          Icon: domain.icon,
        });
      }
    }
    if (navItems.length > 0) result.unshift({ header: 'Jump to', headerIcon: Compass, items: navItems });

    return result;
  }, [query, recentIds]);

  const entries = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, entries.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = entries[activeIndex];
      if (target) go(target.path);
    }
  };

  // Running index across groups so keyboard navigation matches render order.
  let runningIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'top-[14%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-2xl',
          isModern && 'rounded-3xl border-border/70 bg-card/85 shadow-apple-lg backdrop-blur-2xl',
        )}
        data-testid="command-palette"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search modules</DialogTitle>
        </DialogHeader>

        <div className={cn('flex items-center gap-3 border-b px-4', isModern && 'px-5')}>
          {isModern ? (
            <span className="brand-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search modules and challenges…"
            aria-label="Search modules"
            data-testid="command-input"
            className={cn(
              'w-full bg-transparent outline-none placeholder:text-muted-foreground',
              isModern ? 'h-14 text-base' : 'h-12 text-sm',
            )}
          />
          <kbd className="hidden shrink-0 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          className={cn('overflow-y-auto p-2', isModern ? 'max-h-[60vh] p-2.5' : 'max-h-[60vh]')}
          role="listbox"
          aria-label="Search results"
        >
          {entries.length === 0 ? (
            <li className="px-3 py-12 text-center text-sm text-muted-foreground">
              No modules match “{query}”.
            </li>
          ) : (
            groups.map((group) => (
              <li key={group.header ?? 'all'} className="mb-1">
                {group.header ? (
                  <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.headerIcon ? (
                      <group.headerIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : null}
                    {group.header}
                  </p>
                ) : null}
                <ul role="group" aria-label={group.header}>
                  {group.items.map((entry) => {
                    runningIndex += 1;
                    const index = runningIndex;
                    const selected = index === activeIndex;
                    const { Icon } = entry;
                    const isFavorite = favoriteIds.includes(entry.id);
                    return (
                      <li
                        key={entry.id}
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          'flex items-center transition-colors',
                          isModern ? 'rounded-xl' : 'rounded-lg',
                          selected
                            ? isModern
                              ? 'bg-accent text-accent-foreground ring-1 ring-primary/30'
                              : 'bg-accent text-accent-foreground'
                            : 'text-foreground',
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => go(entry.path)}
                          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
                        >
                          {isModern ? (
                            <span
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                                selected ? 'brand-icon text-white' : 'bg-muted text-muted-foreground',
                              )}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : (
                            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {highlight(entry.title, query)}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {entry.description}
                            </span>
                          </span>
                        </button>
                        <div className="flex shrink-0 items-center gap-2 pl-1 pr-3">
                          <span
                            className={cn(
                              'hidden whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline',
                              isModern ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                            )}
                          >
                            {entry.meta}
                          </span>
                          {entry.kind === 'module' ? (
                            <button
                              type="button"
                              onClick={() => dispatch(toggleFavorite(entry.id))}
                              aria-pressed={isFavorite}
                              aria-label={
                                isFavorite
                                  ? `Remove ${entry.title} from favorites`
                                  : `Add ${entry.title} to favorites`
                              }
                              data-testid={`favorite-${entry.id}`}
                              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
                            >
                              <Star
                                className={cn('h-4 w-4', isFavorite && 'fill-primary text-primary')}
                                aria-hidden="true"
                              />
                            </button>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground">
          <span data-testid="command-result-count">
            {entries.length} result{entries.length === 1 ? '' : 's'}
          </span>
          {isModern ? (
            <span className="hidden items-center gap-1.5 sm:flex">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-medium">↑</kbd>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-medium">↓</kbd>
              navigate
              <kbd className="ml-1 rounded border bg-muted px-1.5 py-0.5 font-medium">↵</kbd>
              open
            </span>
          ) : (
            <span className="hidden sm:inline">↑↓ navigate · ↵ open · esc close</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
