import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ModuleMeta } from '@/config/modules';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const difficultyTone = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

export function ModuleCard({ module }: { module: ModuleMeta }) {
  const Icon = module.icon;
  return (
    <Link
      to={module.path}
      data-testid={`module-card-${module.id}`}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <Badge variant={difficultyTone[module.difficulty]} className="capitalize">
          {module.difficulty}
        </Badge>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{module.title}</h3>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open module <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
