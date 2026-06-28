import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Boxes, Puzzle, Workflow, Chrome, Drama } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { ProgressRing } from '@/components/common/ProgressRing';
import { CountPill } from '@/components/layout/nav-primitives';
import {
  buildLearningTree,
  buildPracticeTree,
  CHALLENGE_CATEGORIES,
  WORKFLOW_CATEGORIES,
  getModulesByCategory,
  type LearningCategory,
} from '@/config/navigation';
import { LEARNING_TRACKS, TOTAL_LESSONS } from '@/config/learning';
import { MODULES } from '@/config/modules';
import { useLearningProgress, useModuleProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

const TOOL_ICON: Record<LearningCategory, typeof Chrome> = { Selenium: Chrome, Playwright: Drama };

const PRACTICE_COUNT = MODULES.filter(
  (m) => m.category !== 'Async Challenges' && m.category !== 'Business Workflows',
).length;
const CHALLENGE_COUNT = CHALLENGE_CATEGORIES.reduce((s, c) => s + getModulesByCategory(c).length, 0);
const WORKFLOW_COUNT = WORKFLOW_CATEGORIES.reduce((s, c) => s + getModulesByCategory(c).length, 0);

function PrimaryCard({
  to,
  icon: Icon,
  title,
  description,
  meta,
  cta,
  testId,
  pct,
}: {
  to: string;
  icon: typeof GraduationCap;
  title: string;
  description: string;
  meta: string;
  cta: string;
  testId: string;
  pct: number;
}) {
  return (
    <Link
      to={to}
      data-testid={testId}
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
      <div className="flex items-start justify-between">
        <span className="brand-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        {pct > 0 ? <ProgressRing value={pct} size={40} showLabel /> : null}
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-xs font-medium text-muted-foreground">{meta}</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const learning = useLearningProgress();
  const modules = useModuleProgress();
  const learningTree = buildLearningTree();
  const practiceTree = buildPracticeTree();

  return (
    <PageContainer>
      <PageHeader
        title="Explore the lab"
        description="Choose a path: follow the guided courses, drill on hands-on modules, or take on the tricky stuff. Everything is organised so you always know where you are."
      />

      {/* Primary paths */}
      <div className="grid gap-4 sm:grid-cols-2" data-testid="explore-primary">
        <ScrollReveal>
          <PrimaryCard
            to="/learning"
            icon={GraduationCap}
            title="Learning Modules"
            description="Guided, step-by-step courses with runnable programs — Selenium (Java) and Playwright (TypeScript), beginner to expert."
            meta={`${LEARNING_TRACKS.length} courses · ${TOTAL_LESSONS} lessons`}
            cta="Start learning"
            testId="explore-learning"
            pct={learning.pct}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.06}>
          <PrimaryCard
            to="/modules"
            icon={Boxes}
            title="Practice Modules"
            description="A hands-on sandbox of real controls with stable data-testid hooks — buttons, forms, tables, dialogs and far more."
            meta={`${PRACTICE_COUNT} modules · ${practiceTree.length} domains`}
            cta="Start practising"
            testId="explore-practice"
            pct={modules.pct}
          />
        </ScrollReveal>
      </div>

      {/* Learn by tool */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Learn by tool</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {learningTree.map((tool, i) => {
            const Icon = TOOL_ICON[tool.category];
            return (
              <ScrollReveal key={tool.category} delay={i * 0.05}>
                <Link
                  to={`/learning#${tool.category.toLowerCase()}`}
                  data-testid={`explore-tool-${tool.category.toLowerCase()}`}
                  className="group flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{tool.category}</h3>
                    <p className="text-xs text-muted-foreground">
                      {tool.tracks.length} courses · {tool.lessonCount} lessons · {tool.levels.length} levels
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Practice by domain */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Practice by domain</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="explore-domains">
          {practiceTree.map((node, i) => {
            const Icon = node.domain.icon;
            return (
              <ScrollReveal key={node.domain.id} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', node.domain.accent)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{node.domain.label}</h3>
                      <p className="text-xs text-muted-foreground">{node.domain.tagline}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {node.categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        data-testid={`explore-category-${cat.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <span className="truncate">{cat.category}</span>
                        <CountPill>{cat.modules.length}</CountPill>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Go deeper */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Go deeper</h2>
        <div className="grid gap-4 sm:grid-cols-2" data-testid="explore-secondary">
          <ScrollReveal>
            <Link
              to="/challenges"
              data-testid="explore-challenges"
              className="group flex h-full items-center gap-4 rounded-xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Puzzle className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">Challenges</h3>
                <p className="text-xs text-muted-foreground">Deliberately flaky, timing-driven scenarios that stress your waits and selectors.</p>
              </div>
              <CountPill>{CHALLENGE_COUNT}</CountPill>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={0.06}>
            <Link
              to="/workflows"
              data-testid="explore-workflows"
              className="group flex h-full items-center gap-4 rounded-xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <Workflow className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">Workflows</h3>
                <p className="text-xs text-muted-foreground">Realistic, end-to-end journeys across full application flows (sign-in required).</p>
              </div>
              <CountPill>{WORKFLOW_COUNT}</CountPill>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PageContainer>
  );
}
