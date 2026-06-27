import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListChecks,
  Target,
} from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { LessonContent } from '@/components/common/LessonContent';
import { RelatedPractice } from '@/components/common/RelatedPractice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getLesson,
  getAdjacentLessons,
  lessonLevel,
  DIFFICULTY_LABELS,
  lessonPath,
  trackPath,
} from '@/config/learning';
import { cn } from '@/lib/utils';

const levelTone = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

/** Reads a single lesson with an in-track lesson list and prev/next nav. */
export default function LessonPage() {
  const { trackId = '', lessonId = '' } = useParams();
  const found = getLesson(trackId, lessonId);

  if (!found) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Lesson not found</h1>
          <p className="text-sm text-muted-foreground">That lesson does not exist.</p>
          <Button asChild variant="outline">
            <Link to="/learning" data-testid="lesson-back">
              <ArrowLeft className="h-4 w-4" /> Back to Learning
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const { track, lesson, index } = found;
  const { prev, next } = getAdjacentLessons(trackId, lessonId);
  const Icon = track.icon;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Lesson list (sticky on desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <Link
              to={trackPath(track.id)}
              data-testid="lesson-track-link"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <span className="brand-icon flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="truncate">{track.title}</span>
            </Link>
            <ol className="space-y-1 border-l pl-3" data-testid="lesson-sidebar">
              {track.lessons.map((l, i) => {
                const active = l.id === lesson.id;
                return (
                  <li key={l.id}>
                    <Link
                      to={lessonPath(track.id, l.id)}
                      data-testid={`lesson-nav-${l.id}`}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                        active
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <span className="text-xs tabular-nums opacity-70">{i + 1}.</span>
                      <span className="truncate">{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        {/* Lesson content */}
        <article className="min-w-0 space-y-6">
          <Link
            to={trackPath(track.id)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            data-testid="lesson-back"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {track.title}
          </Link>

          <header className="space-y-3 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <Badge variant="secondary" className="rounded-full">
                Lesson {index + 1} of {track.lessons.length}
              </Badge>
              <Badge variant={levelTone[lessonLevel(track, lesson)]} className="rounded-full capitalize">
                {DIFFICULTY_LABELS[lessonLevel(track, lesson)]}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {lesson.duration} min read
              </span>
            </div>
            <h1
              className="text-3xl font-bold tracking-tight text-foreground"
              data-testid="lesson-title"
            >
              {lesson.title}
            </h1>
            <p className="text-base text-muted-foreground">{lesson.summary}</p>
          </header>

          {/* Objectives */}
          <section
            aria-label="Learning objectives"
            className="rounded-xl border border-primary/20 bg-primary/5 p-5"
          >
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              What you’ll learn
            </h2>
            <ul className="space-y-2">
              {lesson.objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {obj}
                </li>
              ))}
            </ul>
          </section>

          <LessonContent blocks={lesson.blocks} />

          <RelatedPractice moduleIds={lesson.practice} />

          {/* Prev / next lesson */}
          <nav
            aria-label="Lesson navigation"
            data-testid="lesson-nav"
            className="grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
          >
            {prev ? (
              <LessonNavLink
                to={lessonPath(track.id, prev.id)}
                title={prev.title}
                direction="prev"
              />
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <LessonNavLink
                to={lessonPath(track.id, next.id)}
                title={next.title}
                direction="next"
              />
            ) : (
              <NextTrackOrDone trackId={track.id} />
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}

function LessonNavLink({
  to,
  title,
  direction,
}: {
  to: string;
  title: string;
  direction: 'prev' | 'next';
}) {
  const isNext = direction === 'next';
  return (
    <Link
      to={to}
      data-testid={`lesson-${direction}`}
      className={cn(
        'group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isNext ? 'text-right sm:flex-row-reverse' : 'text-left',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
        {isNext ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {isNext ? 'Next lesson' : 'Previous lesson'}
        </span>
        <span className="block truncate font-semibold text-foreground">{title}</span>
      </span>
    </Link>
  );
}

function NextTrackOrDone({ trackId }: { trackId: string }) {
  return (
    <Link
      to="/learning"
      data-testid="lesson-finish"
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-right shadow-card transition-all',
        'hover:-translate-y-0.5 hover:shadow-apple-lg sm:flex-row-reverse',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
        <ListChecks className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Course complete — {trackId}
        </span>
        <span className="block truncate font-semibold text-foreground">Back to all tracks</span>
      </span>
    </Link>
  );
}
