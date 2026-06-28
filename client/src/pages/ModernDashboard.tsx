import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight,
  Boxes,
  Layers,
  FlaskConical,
  Workflow,
  Clock,
  Star,
  MousePointer2,
  GraduationCap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModuleCard } from '@/components/common/ModuleCard';
import { CategoryCard } from '@/components/common/CategoryCard';
import { LearningTrackCard } from '@/components/common/LearningTrackCard';
import { AdSlot } from '@/components/common/AdSlot';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import {
  MODULES,
  MODULE_CATEGORIES,
  searchModules,
  type ModuleMeta,
} from '@/config/modules';
import { LEARNING_TRACKS, TOTAL_LESSONS, searchLearningTracks } from '@/config/learning';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector } from '@/store/hooks';

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

/* ── Pinned, scroll-scrubbed hero (scrollytelling) ─────────────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const hint = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={reduceMotion ? undefined : { opacity, scale, y }}
      className="mx-auto max-w-3xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        The modern automation sandbox
      </span>
      <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        Master <span className="text-gradient-brand">UI &amp; API automation</span>
        <br className="hidden sm:block" /> in one immersive playground.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        Every control ships with stable{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data-testid</code> hooks and
        accessible semantics — built for Selenium, Cypress and Playwright.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/learning"
          data-testid="hero-start-learning"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[hsl(214_85%_50%)] px-6 py-3 text-sm font-semibold text-white shadow-apple-lg transition-transform hover:-translate-y-0.5"
        >
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Start learning
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
        <Link
          to="/modules"
          data-testid="hero-browse-practice"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
        >
          <Boxes className="h-4 w-4" aria-hidden="true" />
          Browse practice modules
        </Link>
      </div>
    </motion.div>
  );

  if (reduceMotion) {
    return <section className="flex min-h-[60vh] items-center justify-center">{content}</section>;
  }

  return (
    <section ref={ref} className="relative h-[170vh]">
      <div className="sticky top-24 flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center">
        {content}
        <motion.div
          style={{ opacity: hint }}
          className="absolute bottom-10 flex flex-col items-center gap-1 text-xs text-muted-foreground"
          aria-hidden="true"
        >
          <MousePointer2 className="h-4 w-4" />
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
}

export function ModernDashboard() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);
  const results = useMemo(() => searchModules(debounced), [debounced]);
  const learningResults = useMemo(() => searchLearningTracks(debounced), [debounced]);

  const favoriteIds = useAppSelector((s) => s.prefs.favorites);
  const recentIds = useAppSelector((s) => s.prefs.recents);
  const byId = useMemo(() => new Map(MODULES.map((m) => [m.id, m] as const)), []);
  const favorites = favoriteIds.map((id) => byId.get(id)).filter(Boolean) as ModuleMeta[];
  const recents = recentIds.map((id) => byId.get(id)).filter(Boolean) as ModuleMeta[];

  return (
    <div className="space-y-20">
      <Hero />

      {/* Animated stats bar */}
      <ScrollReveal>
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border/70 bg-card/60 p-4 backdrop-blur-xl sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-5">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span className="brand-icon flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <AnimatedCounter
                value={value}
                className="mt-1 text-2xl font-bold text-foreground"
                data-testid={`stat-${label}`}
              />
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <AdSlot slot="0000000000" testId="ad-dashboard-top" />

      {/* Search */}
      <section className="space-y-5">
        <div className="relative mx-auto max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search every module and course…"
            aria-label="Search modules and courses"
            data-testid="dashboard-search"
            className="h-12 rounded-full pl-11 text-base"
          />
        </div>

        {debounced.trim() ? (
          results.length === 0 && learningResults.length === 0 ? (
            <p className="rounded-3xl border border-dashed py-16 text-center text-sm text-muted-foreground">
              Nothing matches “{debounced}”.
            </p>
          ) : (
            <div className="space-y-8" data-testid="dashboard-results">
              {learningResults.length > 0 ? (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
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
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
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
        ) : null}
      </section>

      {!debounced.trim() ? (
        <>
          {/* Favorites */}
          {favorites.length > 0 ? (
            <ScrollReveal>
              <section className="space-y-4" data-testid="favorites-section">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Your favorites</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          ) : null}

          {/* Recently viewed */}
          {recents.length > 0 ? (
            <ScrollReveal>
              <section className="space-y-4" data-testid="recents-section">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Recently viewed</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recents.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          ) : null}

          {/* Learning courses — guided, step-by-step tracks. */}
          <section className="space-y-6" data-testid="dashboard-learning">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Learn step by step
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {LEARNING_TRACKS.length} courses · {TOTAL_LESSONS} guided lessons across Selenium
                  and Playwright — from first test to expert level.
                </p>
              </div>
              <Link
                to="/learning"
                data-testid="dashboard-learning-all"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                All courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LEARNING_TRACKS.map((track, index) => (
                <ScrollReveal key={track.id} delay={index * 0.05}>
                  <LearningTrackCard track={track} />
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Browse by category — pick a category to open its landing page.
              Rendered statically (no scroll-jacking) so automation can reach
              any category card immediately. */}
          <section id="explore" className="space-y-6" data-testid="browse-by-category">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Browse practice modules
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a category to explore its modules and challenges.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULE_CATEGORIES.map((category, index) => (
                <ScrollReveal key={category} delay={index * 0.05}>
                  <CategoryCard category={category} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <AdSlot slot="1111111111" testId="ad-dashboard-bottom" />
    </div>
  );
}
