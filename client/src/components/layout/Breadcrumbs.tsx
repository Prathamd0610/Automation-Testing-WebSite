import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { MODULES, getCategoryBySlug } from '@/config/modules';
import { getTrackById, getLesson } from '@/config/learning';

const STATIC_LABELS: Record<string, string> = {
  modules: 'Modules',
  challenges: 'Challenges',
  workflows: 'Workflows',
  learning: 'Learning',
  category: 'Categories',
  login: 'Sign in',
  register: 'Create account',
};

function labelFor(pathname: string, segment: string): string {
  // Learning routes: resolve track and lesson titles from their config.
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'learning') {
    const trackId = parts[1];
    const lessonId = parts[2];
    if (parts.length === 2 && trackId) return getTrackById(trackId)?.title ?? segment;
    if (parts.length === 3 && trackId && lessonId) {
      return getLesson(trackId, lessonId)?.lesson.title ?? segment;
    }
  }

  const module = MODULES.find((m) => m.path === pathname);
  if (module) return module.title;
  const category = getCategoryBySlug(segment);
  if (category) return category;
  return STATIC_LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-foreground" data-testid="breadcrumb-home">
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const to = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = labelFor(to, segment);
          // The bare "/category" path has no page of its own, so render it as
          // plain text instead of a dead link.
          const isLink = !isLast && segment !== 'category';
          return (
            <Fragment key={to}>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {isLink ? (
                  <Link to={to} className="hover:text-foreground">
                    {label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'font-medium text-foreground' : undefined}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
