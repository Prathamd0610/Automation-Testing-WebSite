import {
  Home,
  Compass,
  GraduationCap,
  Boxes,
  Puzzle,
  Workflow,
  ShieldCheck,
  Shapes,
  LayoutGrid,
  Binary,
  Sparkles,
  TrendingUp,
  Network,
  type LucideIcon,
} from 'lucide-react';
import {
  MODULE_CATEGORIES,
  getModulesByCategory,
  getCategoriesBySection,
  categorySlug,
  type ModuleCategory,
  type ModuleMeta,
  type Difficulty,
} from './modules';
import {
  LEARNING_CATEGORIES,
  getTracksByCategory,
  getTracksByCategoryAndLevel,
  type LearningCategory,
  type LearningTrack,
} from './learning';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Unified navigation taxonomy — the single source of truth for the entire
 *  information architecture, consumed by BOTH the Classic (sidebar) and Modern
 *  (floating mega-nav) shells, the command palette, breadcrumbs and the
 *  Explore / Catalog / Category pages.
 *
 *  Hierarchy
 *  ─────────
 *    Learn      →  Tool (Selenium / Playwright)  →  Level band  →  Track  →  Lesson
 *    Practice   →  Domain  →  Category  →  Module
 *    Challenges →  (Async Challenges)  →  Module
 *    Workflows  →  (Business Workflows)  →  Module
 * ──────────────────────────────────────────────────────────────────────────
 */

/* ════════════════════════════════════════════════════════════════════════
   PRIMARY DESTINATIONS — the top-level rail shared by both shells
   ════════════════════════════════════════════════════════════════════════ */

export interface PrimaryDestination {
  id: string;
  to: string;
  label: string;
  icon: LucideIcon;
  testId: string;
  /** Match nested routes as "active" (e.g. /learning/* for Learn). */
  match?: string[];
  end?: boolean;
  /** Only render for signed-in admins. */
  adminOnly?: boolean;
  description: string;
}

export const PRIMARY_DESTINATIONS: PrimaryDestination[] = [
  {
    id: 'home',
    to: '/',
    label: 'Home',
    icon: Home,
    testId: 'nav-dashboard',
    end: true,
    description: 'Your dashboard and jumping-off point.',
  },
  {
    id: 'explore',
    to: '/explore',
    label: 'Explore',
    icon: Compass,
    testId: 'nav-explore',
    match: ['/explore'],
    description: 'Choose a path: learn, practise, challenge or build.',
  },
  {
    id: 'learn',
    to: '/learning',
    label: 'Learn',
    icon: GraduationCap,
    testId: 'nav-learning',
    match: ['/learning'],
    description: 'Guided Selenium & Playwright courses, beginner to expert.',
  },
  {
    id: 'practice',
    to: '/modules',
    label: 'Practice',
    icon: Boxes,
    testId: 'nav-practice',
    match: ['/modules', '/category'],
    description: 'Hands-on modules for real automation drills.',
  },
  {
    id: 'challenges',
    to: '/challenges',
    label: 'Challenges',
    icon: Puzzle,
    testId: 'nav-challenges',
    match: ['/challenges'],
    description: 'Deliberately flaky, timing-driven scenarios.',
  },
  {
    id: 'workflows',
    to: '/workflows',
    label: 'Workflows',
    icon: Workflow,
    testId: 'nav-workflows',
    match: ['/workflows'],
    description: 'End-to-end journeys across realistic apps.',
  },
  {
    id: 'admin',
    to: '/admin',
    label: 'Admin',
    icon: ShieldCheck,
    testId: 'nav-admin',
    match: ['/admin'],
    adminOnly: true,
    description: 'Manage users, data and broadcasts.',
  },
];

/* ════════════════════════════════════════════════════════════════════════
   PRACTICE DOMAINS — a new grouping layer above categories so Practice reads
   as a clean tree: Domain → Category → Module.
   ════════════════════════════════════════════════════════════════════════ */

export interface PracticeDomain {
  id: string;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the domain's accent chip. */
  accent: string;
  categories: ModuleCategory[];
}

export const PRACTICE_DOMAINS: PracticeDomain[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    tagline: 'The everyday building blocks',
    description: 'Inputs, form controls and pointer/keyboard interactions — the core of every UI.',
    icon: Shapes,
    accent: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
    categories: ['Form Controls', 'Interactions'],
  },
  {
    id: 'components-data',
    label: 'Components & Data',
    tagline: 'Composite widgets & live data',
    description: 'Modals, tables, tabs and the network/data behaviours that drive real apps.',
    icon: LayoutGrid,
    accent: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
    categories: ['Components', 'Data & Network'],
  },
  {
    id: 'advanced',
    label: 'Advanced DOM',
    tagline: 'The tricky corners',
    description: 'Shadow DOM, iframes, nested frames and canvas — the structures that break naive scripts.',
    icon: Binary,
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    categories: ['Advanced DOM'],
  },
];

export function domainSlug(domain: PracticeDomain): string {
  return domain.id;
}

export function getDomainById(id: string): PracticeDomain | undefined {
  return PRACTICE_DOMAINS.find((d) => d.id === id);
}

/** Reverse lookup: which domain owns a given practice category. */
export function getDomainForCategory(category: ModuleCategory): PracticeDomain | undefined {
  return PRACTICE_DOMAINS.find((d) => d.categories.includes(category));
}

/** Total practice modules inside a domain. */
export function domainModuleCount(domain: PracticeDomain): number {
  return domain.categories.reduce((sum, c) => sum + getModulesByCategory(c).length, 0);
}

/* ════════════════════════════════════════════════════════════════════════
   SECTIONS — Challenges & Workflows reuse the category-as-section idea but get
   friendly metadata here so both shells can render them consistently.
   ════════════════════════════════════════════════════════════════════════ */

export interface SectionMeta {
  id: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  basePath: string;
}

export const CHALLENGES_SECTION: SectionMeta = {
  id: 'challenges',
  label: 'Challenges',
  tagline: 'Flaky-by-design scenarios',
  icon: Puzzle,
  basePath: '/challenges',
};

export const WORKFLOWS_SECTION: SectionMeta = {
  id: 'workflows',
  label: 'Workflows',
  tagline: 'Realistic end-to-end apps',
  icon: Workflow,
  basePath: '/workflows',
};

/** The categories that live under Challenges / Workflows (by route prefix). */
export const CHALLENGE_CATEGORIES = getCategoriesBySection('challenges');
export const WORKFLOW_CATEGORIES = getCategoriesBySection('workflows');

/* ════════════════════════════════════════════════════════════════════════
   DIFFICULTY — a shared visual model used everywhere a level is shown.
   ════════════════════════════════════════════════════════════════════════ */

export interface DifficultyMeta {
  label: string;
  /** Solid dot colour. */
  dot: string;
  /** Subtle pill (bg + text). */
  pill: string;
  icon: LucideIcon;
}

export const DIFFICULTY_META: Record<Difficulty, DifficultyMeta> = {
  beginner: {
    label: 'Beginner',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
    icon: Sparkles,
  },
  intermediate: {
    label: 'Intermediate',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
    icon: TrendingUp,
  },
  advanced: {
    label: 'Advanced',
    dot: 'bg-rose-500',
    pill: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
    icon: Network,
  },
};

export const DIFFICULTY_SEQUENCE: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

/** Group an array of modules into ordered difficulty bands (skips empties). */
export function groupByDifficulty(
  modules: ModuleMeta[],
): { level: Difficulty; modules: ModuleMeta[] }[] {
  return DIFFICULTY_SEQUENCE.map((level) => ({
    level,
    modules: modules.filter((m) => m.difficulty === level),
  })).filter((band) => band.modules.length > 0);
}

/* ════════════════════════════════════════════════════════════════════════
   "NEW" FLAGS — surface the most recently added modules with a badge without
   touching the 55 individual module definitions.
   ════════════════════════════════════════════════════════════════════════ */

export const NEW_MODULE_IDS = new Set<string>([
  'rating',
  'color-picker',
  'otp-input',
  'context-menu',
  'sortable-list',
  'carousel',
  'tree-view',
  'stepper',
  'notifications',
  'rich-text',
  'download',
  'lazy-images',
  'canvas',
  'search-filter',
]);

export function isNewModule(id: string): boolean {
  return NEW_MODULE_IDS.has(id);
}

/* ════════════════════════════════════════════════════════════════════════
   TREE BUILDERS — the canonical shapes both shells render from.
   ════════════════════════════════════════════════════════════════════════ */

export interface PracticeCategoryNode {
  category: ModuleCategory;
  slug: string;
  modules: ModuleMeta[];
}

export interface PracticeDomainNode {
  domain: PracticeDomain;
  categories: PracticeCategoryNode[];
  moduleCount: number;
}

/** Domain → Category → Module, in declared order. */
export function buildPracticeTree(): PracticeDomainNode[] {
  return PRACTICE_DOMAINS.map((domain) => {
    const categories = domain.categories.map((category) => ({
      category,
      slug: categorySlug(category),
      modules: getModulesByCategory(category),
    }));
    return {
      domain,
      categories,
      moduleCount: categories.reduce((sum, c) => sum + c.modules.length, 0),
    };
  });
}

export interface LearningLevelNode {
  level: Difficulty;
  tracks: LearningTrack[];
}

export interface LearningToolNode {
  category: LearningCategory;
  tracks: LearningTrack[];
  levels: LearningLevelNode[];
  lessonCount: number;
}

/** Tool (Selenium / Playwright) → Level band → Track. */
export function buildLearningTree(): LearningToolNode[] {
  return LEARNING_CATEGORIES.map((category) => {
    const tracks = getTracksByCategory(category);
    const levels = DIFFICULTY_SEQUENCE.map((level) => ({
      level,
      tracks: getTracksByCategoryAndLevel(category, level),
    })).filter((band) => band.tracks.length > 0);
    return {
      category,
      tracks,
      levels,
      lessonCount: tracks.reduce((sum, t) => sum + t.lessons.length, 0),
    };
  }).filter((tool) => tool.tracks.length > 0);
}

/* ════════════════════════════════════════════════════════════════════════
   Convenience re-exports so consumers import the whole IA from one place.
   ════════════════════════════════════════════════════════════════════════ */

export {
  MODULE_CATEGORIES,
  getModulesByCategory,
  categorySlug,
  type ModuleCategory,
  type ModuleMeta,
  type Difficulty,
};
export { LEARNING_CATEGORIES, getTracksByCategory, type LearningCategory, type LearningTrack };
