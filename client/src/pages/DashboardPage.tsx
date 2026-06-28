import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FlaskConical,
  Layers,
  Boxes,
  Workflow,
  GraduationCap,
  ArrowRight,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModuleCard } from '@/components/common/ModuleCard';
import { CategoryCard } from '@/components/common/CategoryCard';
import { LearningTrackCard } from '@/components/common/LearningTrackCard';
import { LearningTracksByCategory } from '@/components/common/LearningTracksByCategory';
import { AdSlot } from '@/components/common/AdSlot';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Parallax } from '@/components/common/Parallax';
import { ModernDashboard } from '@/pages/ModernDashboard';
import { MODULES, MODULE_CATEGORIES, searchModules } from '@/config/modules';
import { TOTAL_LESSONS, searchLearningTracks } from '@/config/learning';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleLauncher } from '@/store/uiSlice';

const PRACTICE_MODULE_COUNT = MODULES.filter(
  (m) => m.category !== 'Async Challenges' && m.category !== 'Business Workflows',
).length;

const STATS = [
  { label: 'Practice modules', value: PRACTICE_MODULE_COUNT, icon: Boxes },
  { label: 'Categories', value: MODULE_CATEGORIES.length, icon: Layers },
  { label: 'Learning lessons', value: TOTAL_LESSONS, icon: GraduationCap },
  {
    label: 'Async challenges',
    value: MODULES.filter((m) => m.category === 'Async Challenges').length,
    icon: FlaskConical,
  },
  {
    label: 'Business workflows',
    value: MODULES.filter((m) => m.category === 'Business Workflows').length,
    icon: Workflow,
  },
];

export default function DashboardPage() {
  const uiMode = useAppSelector((state) => state.ui.uiMode);
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);
  const results = useMemo(() => searchModules(debounced), [debounced]);
  const learningResults = useMemo(() => searchLearningTracks(debounced), [debounced]);

  if (uiMode === 'modern') {
    return <ModernDashboard />;
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10">
        {/* Soft decorative glows — same brand colour, just blurred for depth. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />

        <Parallax offset={40}>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            MERN · TypeScript · WCAG 2.1 AA
          </span>
          <h1 className="mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Practice <span className="text-gradient-brand">UI &amp; API automation</span> in one safe,
            realistic sandbox.
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            Learn step by step, then automate real{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data-testid</code> controls —
            built for Selenium, Cypress and Playwright.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/learning"
              data-testid="hero-start-learning"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-apple-lg transition-transform hover:-translate-y-0.5"
            >
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Start learning
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/modules"
              data-testid="hero-browse-practice"
              className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              <Boxes className="h-4 w-4" aria-hidden="true" />
              Browse practice
            </Link>
            <button
              type="button"
              onClick={() => dispatch(toggleLauncher())}
              data-testid="hero-launcher"
              className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              All modules
            </button>
          </div>
        </Parallax>

        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map(({ label, value, icon: Icon }, index) => (
            <ScrollReveal key={label} delay={index * 0.06}>
              <div className="h-full rounded-2xl border bg-card/70 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg">
                <span className="brand-icon flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-2xl font-bold tracking-tight text-foreground" data-testid={`stat-${label}`}>
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Ad placement — replace the slot id with your real AdSense ad unit id. */}
      <AdSlot slot="0000000000" testId="ad-dashboard-top" />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search modules and courses…"
          aria-label="Search modules and courses"
          data-testid="dashboard-search"
          className="pl-9"
        />
      </div>

      {debounced.trim() ? (
        results.length === 0 && learningResults.length === 0 ? (
          <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            Nothing matches “{debounced}”.
          </p>
        ) : (
          <div className="space-y-8" data-testid="dashboard-results">
            {learningResults.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Learning courses
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {learningResults.map((track) => (
                    <LearningTrackCard key={track.id} track={track} />
                  ))}
                </div>
              </section>
            ) : null}
            {results.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Practice modules
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )
      ) : (
        <>
          <section className="space-y-4" data-testid="dashboard-learning">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Learn step by step
                </h2>
              </div>
              <Link
                to="/learning"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                data-testid="dashboard-learning-all"
              >
                All courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <LearningTracksByCategory />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Browse practice modules</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULE_CATEGORIES.map((category) => (
                <CategoryCard key={category} category={category} />
              ))}
            </div>
          </section>
        </>
      )}

      <AdSlot slot="1111111111" testId="ad-dashboard-bottom" />
    </div>
  );
}
