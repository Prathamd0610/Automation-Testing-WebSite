import { ExternalLink, FlaskConical } from 'lucide-react';
import { getPracticeModules } from '@/config/learning';
import { cn } from '@/lib/utils';

/**
 * Side-by-side practice integration for a lesson. Renders the live practice
 * modules related to the lesson and opens them in a new tab so a learner can
 * read on one side and automate the real controls on the other.
 */
export function RelatedPractice({ moduleIds }: { moduleIds?: string[] }) {
  const modules = getPracticeModules(moduleIds);
  if (modules.length === 0) return null;

  return (
    <section
      aria-label="Related practice"
      data-testid="lesson-practice"
      className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Practice this side by side</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Open a live module in a new tab and automate the real controls while you follow along — the
        same way the practice modules work.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <a
              key={module.id}
              href={module.path}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`lesson-practice-${module.id}`}
              className={cn(
                'group flex items-center gap-3 rounded-lg border bg-card p-3 shadow-card transition-all',
                'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {module.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {module.tags.slice(0, 3).join(' · ')}
                </span>
              </span>
              <ExternalLink
                className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
