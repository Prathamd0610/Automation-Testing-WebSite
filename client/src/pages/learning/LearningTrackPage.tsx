import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Lock, LogIn, Target } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  getTrackById,
  lessonPath,
  lessonLevel,
  trackDuration,
  DIFFICULTY_LABELS,
  LEARNING_TRACKS,
  trackPath,
} from '@/config/learning';
import { cn } from '@/lib/utils';

const levelTone = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

/** Lists the ordered lessons inside a single learning track. */
export default function LearningTrackPage() {
  const { trackId = '' } = useParams();
  const track = getTrackById(trackId);
  const { isAuthenticated } = useAuth();

  if (!track) {
    return (
      <PageContainer>
        <PageHeader title="Track not found" description="That learning track does not exist." />
        <Button asChild variant="outline">
          <Link to="/learning" data-testid="track-back">
            <ArrowLeft className="h-4 w-4" /> Back to Learning
          </Link>
        </Button>
      </PageContainer>
    );
  }

  const Icon = track.icon;
  const index = LEARNING_TRACKS.findIndex((t) => t.id === track.id);
  const prev = index > 0 ? LEARNING_TRACKS[index - 1] : undefined;
  const next = index < LEARNING_TRACKS.length - 1 ? LEARNING_TRACKS[index + 1] : undefined;
  const firstLesson = track.lessons[0];

  return (
    <PageContainer>
      <Link
        to="/learning"
        data-testid="track-back"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All learning tracks
      </Link>

      <PageHeader
        title={track.title}
        description={track.description}
        icon={<Icon className="h-5 w-5" aria-hidden="true" />}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={levelTone[track.level]} className="capitalize">
              {track.level}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              <BookOpen className="mr-1 h-3.5 w-3.5" /> {track.lessons.length} lessons
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              <Clock className="mr-1 h-3.5 w-3.5" /> {trackDuration(track)} min
            </Badge>
          </div>
        }
      />

      <div className="flex">
        <Button asChild className="rounded-full">
          <Link
            to={lessonPath(track.id, firstLesson ? firstLesson.id : '')}
            data-testid="track-start"
          >
            Start course <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {!isAuthenticated ? (
        <div
          data-testid="track-preview-notice"
          className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            You’re previewing this course — browse the lessons freely, then sign in to read the full content.
          </p>
          <Button asChild size="sm" className="shrink-0 rounded-full">
            <Link to="/login" data-testid="track-signin">
              <LogIn className="h-4 w-4" aria-hidden="true" /> Sign in to read
            </Link>
          </Button>
        </div>
      ) : null}

      <ol className="space-y-3" data-testid="lesson-list">
        {track.lessons.map((lesson, i) => (
          <ScrollReveal key={lesson.id} delay={i * 0.04}>
            <li>
              <Link
                to={lessonPath(track.id, lesson.id)}
                data-testid={`lesson-row-${lesson.id}`}
                className={cn(
                  'group flex items-start gap-4 rounded-xl border bg-card p-4 shadow-card transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant={levelTone[lessonLevel(track, lesson)]}
                        className="hidden text-[10px] capitalize sm:inline-flex"
                      >
                        {DIFFICULTY_LABELS[lessonLevel(track, lesson)]}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {lesson.duration} min
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                  <p className="inline-flex items-center gap-1.5 pt-1 text-xs text-muted-foreground/80">
                    <Target className="h-3.5 w-3.5" aria-hidden="true" />
                    {lesson.objectives.length} learning objectives
                  </p>
                </div>
                {isAuthenticated ? (
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <Lock
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/70 group-hover:text-primary"
                    aria-label="Sign in to read"
                  />
                )}
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ol>

      {/* Jump to an adjacent track */}
      <nav
        aria-label="Adjacent tracks"
        className="flex items-center justify-between gap-3 border-t border-border pt-6"
      >
        {prev ? (
          <Button asChild variant="ghost" className="gap-2">
            <Link to={trackPath(prev.id)} data-testid="track-prev">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{prev.title}</span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="ghost" className="gap-2">
            <Link to={trackPath(next.id)} data-testid="track-next">
              <span className="truncate">{next.title}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </nav>
    </PageContainer>
  );
}
