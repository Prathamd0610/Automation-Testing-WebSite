import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GraduationCap, Chrome, Drama } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
  LEARNING_CATEGORIES,
  CATEGORY_BLURB,
  getTracksByCategory,
  getTracksByCategoryAndLevel,
} from '@/config/learning';
import type { LearningCategory } from '@/config/learning';
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

/** Icon shown next to each tool-family heading. */
const CATEGORY_ICON: Record<LearningCategory, LucideIcon> = {
  Selenium: Chrome,
  Playwright: Drama,
};

/**
 * Learning catalog — courses are first segregated by tool family
 * (Selenium / Playwright), then grouped by difficulty inside each family.
 * Picking a track opens its lesson list.
 */
export default function LearningCatalogPage() {
  const { hash } = useLocation();

  // Scroll to a tool section when arriving via /learning#selenium etc.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <PageContainer>
      <PageHeader
        icon={<GraduationCap className="h-5 w-5" />}
        title="Learning Modules"
        description="Guided, in-depth courses for two automation stacks — Selenium (Java) and Playwright (TypeScript) — from your first test to production-grade, expert-level frameworks. Read the lessons with runnable programs, then practise on the live modules."
        actions={
          <Badge variant="secondary" className="rounded-full" data-testid="learning-count">
            {LEARNING_TRACKS.length} tracks · {TOTAL_LESSONS} lessons
          </Badge>
        }
      />

      {LEARNING_CATEGORIES.map((category) => {
        const categoryTracks = getTracksByCategory(category);
        if (categoryTracks.length === 0) return null;
        const CategoryIcon = CATEGORY_ICON[category];
        const lessonCount = categoryTracks.reduce((sum, t) => sum + t.lessons.length, 0);
        return (
          <section
            key={category}
            id={category.toLowerCase()}
            className="scroll-mt-24 space-y-6"
            data-testid={`learning-category-${category.toLowerCase()}`}
          >
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/50 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CategoryIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold text-foreground">{category}</h2>
                <Badge variant="secondary" className="rounded-full">
                  {categoryTracks.length} tracks · {lessonCount} lessons
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{CATEGORY_BLURB[category]}</p>
            </div>

            {DIFFICULTY_ORDER.map((level) => {
              const tracks = getTracksByCategoryAndLevel(category, level);
              if (tracks.length === 0) return null;
              return (
                <div
                  key={level}
                  className="space-y-4 pl-1"
                  data-testid={`learning-${category.toLowerCase()}-${level}`}
                >
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
                </div>
              );
            })}
          </section>
        );
      })}
    </PageContainer>
  );
}
