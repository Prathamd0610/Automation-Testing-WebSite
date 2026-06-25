import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getAdjacentModules, type ModuleMeta } from '@/config/modules';
import { cn } from '@/lib/utils';

/**
 * Previous / next module navigation rendered at the bottom of every module,
 * challenge and workflow page. Lets you step through activities without going
 * back to the dashboard. Driven by the module order in the config.
 */
export function ModuleNav({ path }: { path: string }) {
  const { prev, next } = getAdjacentModules(path);

  // Not on a real module route (catalog/category pages) — render nothing.
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Module navigation"
      data-testid="module-nav"
      className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <NavLink module={prev} direction="prev" />
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? <NavLink module={next} direction="next" /> : null}
    </nav>
  );
}

function NavLink({
  module,
  direction,
}: {
  module: ModuleMeta;
  direction: 'prev' | 'next';
}) {
  const isNext = direction === 'next';
  return (
    <Link
      to={module.path}
      data-testid={`module-nav-${direction}`}
      className={cn(
        'group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isNext ? 'text-right sm:flex-row-reverse' : 'text-left',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
        {isNext ? (
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {isNext ? 'Next' : 'Previous'}
        </span>
        <span className="block truncate font-semibold text-foreground">{module.title}</span>
      </span>
    </Link>
  );
}
