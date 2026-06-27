import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Boxes, GraduationCap, Puzzle, Workflow } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { MODULES, getCategoriesBySection } from '@/config/modules';
import { LEARNING_TRACKS, TOTAL_LESSONS } from '@/config/learning';
import { cn } from '@/lib/utils';

const PRACTICE_MODULE_COUNT = MODULES.filter(
  (m) => m.category !== 'Async Challenges' && m.category !== 'Business Workflows',
).length;
const CHALLENGE_COUNT = MODULES.filter((m) => m.category === 'Async Challenges').length;
const WORKFLOW_COUNT = MODULES.filter((m) => m.category === 'Business Workflows').length;
const PRACTICE_CATEGORY_COUNT = getCategoriesBySection('modules').length;

interface Choice {
  to: string;
  icon: typeof GraduationCap;
  title: string;
  description: string;
  meta: string;
  cta: string;
  testId: string;
}

const PRIMARY: Choice[] = [
  {
    to: '/learning',
    icon: GraduationCap,
    title: 'Learning Modules',
    description:
      'Guided, step-by-step courses with runnable programs — Selenium, TestNG, Cucumber and a full framework, from beginner to advanced.',
    meta: `${LEARNING_TRACKS.length} courses · ${TOTAL_LESSONS} lessons`,
    cta: 'Start learning',
    testId: 'explore-learning',
  },
  {
    to: '/modules',
    icon: Boxes,
    title: 'Practice Modules',
    description:
      'Hands-on sandbox of real controls with stable data-testid hooks — buttons, forms, tables, dialogs and more to automate.',
    meta: `${PRACTICE_MODULE_COUNT} modules · ${PRACTICE_CATEGORY_COUNT} categories`,
    cta: 'Start practising',
    testId: 'explore-practice',
  },
];

const SECONDARY: Choice[] = [
  {
    to: '/challenges',
    icon: Puzzle,
    title: 'Challenges',
    description: 'Deliberately tricky, flaky-by-design scenarios that stress your selectors and waits.',
    meta: `${CHALLENGE_COUNT} challenges`,
    cta: 'Open challenges',
    testId: 'explore-challenges',
  },
  {
    to: '/workflows',
    icon: Workflow,
    title: 'Workflows',
    description: 'Realistic, end-to-end journeys across full application flows (sign-in required).',
    meta: `${WORKFLOW_COUNT} workflows`,
    cta: 'Open workflows',
    testId: 'explore-workflows',
  },
];

function PrimaryCard({ choice }: { choice: Choice }) {
  const Icon = choice.icon;
  return (
    <Link
      to={choice.to}
      data-testid={choice.testId}
      className={cn(
        'group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-80"
      />
      <span className="brand-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{choice.title}</h2>
        <p className="text-sm text-muted-foreground">{choice.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {choice.meta}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {choice.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function SecondaryCard({ choice }: { choice: Choice }) {
  const Icon = choice.icon;
  return (
    <Link
      to={choice.to}
      data-testid={choice.testId}
      className={cn(
        'group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground">{choice.title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{choice.meta}</span>
        </div>
        <p className="truncate text-sm text-muted-foreground">{choice.description}</p>
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden="true"
      />
    </Link>
  );
}

/**
 * Module hub — lets the visitor choose between the guided Learning courses and
 * the hands-on Practice sandbox before drilling in.
 */
export default function ExplorePage() {
  return (
    <PageContainer>
      <PageHeader
        title="What would you like to do?"
        description="Pick a path: follow the guided Learning courses, or jump straight into the hands-on Practice modules."
      />

      <div className="grid gap-4 sm:grid-cols-2" data-testid="explore-primary">
        {PRIMARY.map((choice, index) => (
          <ScrollReveal key={choice.to} delay={index * 0.06}>
            <PrimaryCard choice={choice} />
          </ScrollReveal>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
          Or keep exploring
        </h2>
        <div className="grid gap-4 sm:grid-cols-2" data-testid="explore-secondary">
          {SECONDARY.map((choice, index) => (
            <ScrollReveal key={choice.to} delay={index * 0.06}>
              <SecondaryCard choice={choice} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
