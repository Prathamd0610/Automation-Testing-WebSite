import { useState } from 'react';
import { ChevronDown, Chrome, Drama } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LEARNING_CATEGORIES, getTracksByCategory } from '@/config/learning';
import type { LearningCategory } from '@/config/learning';
import { LearningTrackCard } from '@/components/common/LearningTrackCard';
import { cn } from '@/lib/utils';

const CATEGORY_ICON: Record<LearningCategory, LucideIcon> = {
  Selenium: Chrome,
  Playwright: Drama,
};

/**
 * The dashboard "Learn step by step" tracks, grouped by tool family
 * (Selenium / Playwright). Each group is a collapsible dropdown so the long
 * list of courses stays compact and scannable.
 */
export function LearningTracksByCategory() {
  return (
    <div className="space-y-3" data-testid="learn-grouped">
      {LEARNING_CATEGORIES.map((category) => (
        <LearningCategorySection key={category} category={category} />
      ))}
    </div>
  );
}

function LearningCategorySection({ category }: { category: LearningCategory }) {
  const tracks = getTracksByCategory(category);
  const [open, setOpen] = useState(true);
  const Icon = CATEGORY_ICON[category];

  if (tracks.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/40">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        data-testid={`learn-group-${category.toLowerCase()}`}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex flex-1 items-baseline gap-2">
          <span className="font-semibold text-foreground">{category}</span>
          <span className="text-xs text-muted-foreground">{tracks.length} courses</span>
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
            open ? '' : '-rotate-90',
          )}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          className="grid gap-4 border-t border-border/60 p-4 sm:grid-cols-2 lg:grid-cols-3"
          data-testid={`learn-group-${category.toLowerCase()}-grid`}
        >
          {tracks.map((track) => (
            <LearningTrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
