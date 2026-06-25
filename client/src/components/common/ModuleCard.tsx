import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import type { ModuleMeta } from '@/config/modules';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/prefsSlice';
import { cn } from '@/lib/utils';

const difficultyTone = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

export function ModuleCard({ module }: { module: ModuleMeta }) {
  const Icon = module.icon;
  const dispatch = useAppDispatch();
  const isModern = useAppSelector((s) => s.ui.uiMode === 'modern');
  const isFavorite = useAppSelector((s) => s.prefs.favorites.includes(module.id));

  return (
    <div className="relative h-full">
      <Link
        to={module.path}
        data-testid={`module-card-${module.id}`}
        className={cn(
          'group relative flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-card transition-all',
          'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        <div className="flex items-start justify-between">
          <span className="brand-icon flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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

      {/* Favorite toggle (modern skin only) — sibling overlay, not nested in the link. */}
      {isModern ? (
        <button
          type="button"
          onClick={() => dispatch(toggleFavorite(module.id))}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${module.title} from favorites` : `Add ${module.title} to favorites`}
          data-testid={`favorite-${module.id}`}
          className="absolute bottom-3 right-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <Star className={cn('h-4 w-4', isFavorite && 'fill-primary text-primary')} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

