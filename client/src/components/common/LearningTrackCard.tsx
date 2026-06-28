import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/common/ProgressRing';
import { type LearningTrack, trackDuration, trackPath } from '@/config/learning';
import { useTrackProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

const levelTone = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

/** A card linking to a learning track. Shared by the catalog and dashboards. */
export function LearningTrackCard({ track }: { track: LearningTrack }) {
  const Icon = track.icon;
  const minutes = trackDuration(track);
  const { done, total, pct } = useTrackProgress(track);
  const complete = pct >= 100;

  return (
    <Link
      to={trackPath(track.id)}
      data-testid={`learning-card-${track.id}`}
      className={cn(
        'group relative flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        complete && 'border-emerald-500/30',
      )}
    >
      <div className="flex items-start justify-between">
        <span className="brand-icon flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex items-center gap-2">
          {pct > 0 ? <ProgressRing value={pct} size={34} showLabel /> : null}
          <Badge variant={levelTone[track.level]} className="capitalize">
            {track.level}
          </Badge>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{track.title}</h3>
        <p className="text-sm text-muted-foreground">{track.description}</p>
      </div>

      <div className="mt-auto flex items-center gap-4 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {track.lessons.length} lessons
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {minutes} min
        </span>
        {pct > 0 ? (
          <span className={cn('inline-flex items-center gap-1', complete && 'text-emerald-600 dark:text-emerald-400')}>
            {complete ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {done}/{total}
          </span>
        ) : null}
        <span className="ml-auto inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {pct > 0 && !complete ? 'Resume' : complete ? 'Review' : 'Start'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
