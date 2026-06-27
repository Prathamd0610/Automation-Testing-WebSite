import { GraduationCap } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { LearningTrackCard } from '@/components/common/LearningTrackCard';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import {
  LEARNING_TRACKS,
  TOTAL_LESSONS,
  DIFFICULTY_ORDER,
  DIFFICULTY_LABELS,
  getTracksByLevel,
} from '@/config/learning';
import type { Difficulty } from '@/config/modules';

const LEVEL_BLURB: Record<Difficulty, string> = {
  beginner: 'New to automation? Start here and learn the fundamentals step by step.',
  intermediate: 'Comfortable with the basics? Structure real, maintainable frameworks.',
  advanced: 'Ready for production scale? Grid, DevTools, design patterns and hybrid testing.',
};

const levelTone = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
} as const;

/**
 * Learning catalog — courses grouped by difficulty (Beginner / Intermediate /
 * Advanced). Picking a track opens its lesson list.
 */
export default function LearningCatalogPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={<GraduationCap className="h-5 w-5" />}
        title="Learning Modules"
        description="Guided, in-depth courses from your first Selenium test to a production-grade framework — read the lessons with runnable programs, then practise on the live modules."
        actions={
          <Badge variant="secondary" className="rounded-full" data-testid="learning-count">
            {LEARNING_TRACKS.length} tracks · {TOTAL_LESSONS} lessons
          </Badge>
        }
      />

      {DIFFICULTY_ORDER.map((level) => {
        const tracks = getTracksByLevel(level);
        if (tracks.length === 0) return null;
        return (
          <section key={level} className="space-y-4" data-testid={`learning-level-${level}`}>
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-2">
              <Badge variant={levelTone[level]} className="rounded-full capitalize">
                {DIFFICULTY_LABELS[level]}
              </Badge>
              <p className="text-sm text-muted-foreground">{LEVEL_BLURB[level]}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track, index) => (
                <ScrollReveal key={track.id} delay={index * 0.05}>
                  <LearningTrackCard track={track} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      })}
    </PageContainer>
  );
}
