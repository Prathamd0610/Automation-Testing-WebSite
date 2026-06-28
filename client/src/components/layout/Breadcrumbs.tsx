import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MODULES,
  getModuleByPath,
  getCategoryBySlug,
  getModulesByCategory,
  categorySlug,
  categorySection,
} from '@/config/modules';
import {
  getDomainForCategory,
  PRACTICE_DOMAINS,
  LEARNING_CATEGORIES,
} from '@/config/navigation';
import {
  getTrackById,
  getLesson,
  getTracksByCategory,
  trackPath,
  lessonPath,
} from '@/config/learning';
import { cn } from '@/lib/utils';

interface SiblingLink {
  label: string;
  to: string;
}
interface Crumb {
  key: string;
  label: string;
  to?: string;
  siblings?: SiblingLink[];
}

const STATIC_LABELS: Record<string, string> = {
  modules: 'Practice',
  challenges: 'Challenges',
  workflows: 'Workflows',
  learning: 'Learn',
  explore: 'Explore',
  login: 'Sign in',
  register: 'Create account',
};

function titleCase(segment: string): string {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildTrail(pathname: string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean);

  // ── Learning ──────────────────────────────────────────────────────────
  if (parts[0] === 'learning') {
    const crumbs: Crumb[] = [{ key: 'learn', label: 'Learn', to: '/learning' }];
    const trackId = parts[1];
    const lessonId = parts[2];
    const track = trackId ? getTrackById(trackId) : undefined;
    if (track) {
      crumbs.push({
        key: 'tool',
        label: track.category,
        to: `/learning#${track.category.toLowerCase()}`,
        siblings: LEARNING_CATEGORIES.map((c) => ({ label: c, to: `/learning#${c.toLowerCase()}` })),
      });
      crumbs.push({
        key: 'track',
        label: track.title,
        to: lessonId ? trackPath(track.id) : undefined,
        siblings: getTracksByCategory(track.category).map((t) => ({ label: t.title, to: trackPath(t.id) })),
      });
      if (lessonId) {
        const found = getLesson(track.id, lessonId);
        if (found) {
          crumbs.push({
            key: 'lesson',
            label: found.lesson.title,
            siblings: track.lessons.map((l) => ({ label: l.title, to: lessonPath(track.id, l.id) })),
          });
        }
      }
    }
    return crumbs;
  }

  // ── Category landing ──────────────────────────────────────────────────
  if (parts[0] === 'category' && parts[1]) {
    const cat = getCategoryBySlug(parts[1]);
    if (!cat) return [{ key: 'cat', label: titleCase(parts[1]) }];
    const crumbs: Crumb[] = [{ key: 'practice', label: 'Practice', to: '/modules' }];
    const domain = getDomainForCategory(cat);
    if (domain) {
      crumbs.push({
        key: 'domain',
        label: domain.label,
        siblings: PRACTICE_DOMAINS.map((d) => ({
          label: d.label,
          to: `/category/${categorySlug(d.categories[0]!)}`,
        })),
      });
    }
    crumbs.push({
      key: 'category',
      label: cat,
      siblings: (domain ? domain.categories : [cat]).map((c) => ({
        label: c,
        to: `/category/${categorySlug(c)}`,
      })),
    });
    return crumbs;
  }

  // ── A concrete module / challenge / workflow page ─────────────────────
  const module = getModuleByPath(pathname);
  if (module) {
    const section = categorySection(module.category);
    if (section === 'modules') {
      const crumbs: Crumb[] = [{ key: 'practice', label: 'Practice', to: '/modules' }];
      const domain = getDomainForCategory(module.category);
      if (domain) {
        crumbs.push({
          key: 'domain',
          label: domain.label,
          siblings: PRACTICE_DOMAINS.map((d) => ({
            label: d.label,
            to: `/category/${categorySlug(d.categories[0]!)}`,
          })),
        });
      }
      crumbs.push({
        key: 'category',
        label: module.category,
        to: `/category/${categorySlug(module.category)}`,
        siblings: domain
          ? domain.categories.map((c) => ({ label: c, to: `/category/${categorySlug(c)}` }))
          : undefined,
      });
      crumbs.push({
        key: 'module',
        label: module.title,
        siblings: getModulesByCategory(module.category).map((m) => ({ label: m.title, to: m.path })),
      });
      return crumbs;
    }
    const sectionLabel = section === 'challenges' ? 'Challenges' : 'Workflows';
    return [
      { key: 'section', label: sectionLabel, to: `/${section}` },
      {
        key: 'module',
        label: module.title,
        siblings: getModulesByCategory(module.category).map((m) => ({ label: m.title, to: m.path })),
      },
    ];
  }

  // ── Fallback: derive from the URL segments ────────────────────────────
  return parts.map((segment, index) => {
    const to = `/${parts.slice(0, index + 1).join('/')}`;
    const moduleAt = MODULES.find((m) => m.path === to);
    return {
      key: to,
      label: moduleAt?.title ?? STATIC_LABELS[segment] ?? titleCase(segment),
      to,
    };
  });
}

function CrumbLabel({ crumb, isLast }: { crumb: Crumb; isLast: boolean }) {
  const hasSiblings = crumb.siblings && crumb.siblings.length > 1;
  const labelEl =
    crumb.to && !isLast ? (
      <Link to={crumb.to} className="hover:text-foreground">
        {crumb.label}
      </Link>
    ) : (
      <span className={isLast ? 'font-medium text-foreground' : undefined} aria-current={isLast ? 'page' : undefined}>
        {crumb.label}
      </span>
    );

  if (!hasSiblings) return labelEl;

  return (
    <span className="inline-flex items-center gap-0.5">
      {labelEl}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="rounded p-0.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
          aria-label={`Switch ${crumb.label}`}
          data-testid={`breadcrumb-switch-${crumb.key}`}
        >
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-72 w-60 overflow-y-auto">
          {crumb.siblings!.map((s) => (
            <DropdownMenuItem key={s.to} asChild>
              <Link to={s.to} className={cn('text-[13px]', s.label === crumb.label && 'font-semibold text-primary')}>
                <span className="truncate">{s.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  const trail = buildTrail(pathname);
  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-foreground" data-testid="breadcrumb-home">
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {trail.map((crumb, index) => (
          <Fragment key={crumb.key}>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <CrumbLabel crumb={crumb} isLast={index === trail.length - 1} />
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
