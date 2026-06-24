import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { MODULES } from '@/config/modules';

const STATIC_LABELS: Record<string, string> = {
  modules: 'Modules',
  challenges: 'Challenges',
  workflows: 'Workflows',
  login: 'Sign in',
  register: 'Create account',
};

function labelFor(pathname: string, segment: string): string {
  const module = MODULES.find((m) => m.path === pathname);
  if (module) return module.title;
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
          return (
            <Fragment key={to}>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-foreground">
                    {label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
