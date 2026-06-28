import type { ReactNode } from 'react';
import { DIFFICULTY_META } from '@/config/navigation';
import type { Difficulty } from '@/config/modules';
import { cn } from '@/lib/utils';

/** A coloured difficulty dot with an accessible title. */
export function LevelDot({ level, className }: { level: Difficulty; className?: string }) {
  return (
    <span
      className={cn('h-2 w-2 shrink-0 rounded-full', DIFFICULTY_META[level].dot, className)}
      title={DIFFICULTY_META[level].label}
      aria-hidden="true"
    />
  );
}

/** Subtle difficulty pill used in headers and cards. */
export function LevelPill({ level, className }: { level: Difficulty; className?: string }) {
  const meta = DIFFICULTY_META[level];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        meta.pill,
        className,
      )}
    >
      <meta.icon className="h-3 w-3" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/** A small "New" flag for recently added modules. */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary',
        className,
      )}
    >
      New
    </span>
  );
}

/** A neutral count chip (e.g. number of modules in a category). */
export function CountPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full bg-muted px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
