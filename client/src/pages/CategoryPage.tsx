import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ModuleCard } from '@/components/common/ModuleCard';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LevelPill } from '@/components/layout/nav-primitives';
import {
  getModulesByCategory,
  getCategoryBySlug,
  categorySlug,
  CATEGORY_DESCRIPTIONS,
} from '@/config/modules';
import { getDomainForCategory, groupByDifficulty } from '@/config/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

/**
 * Landing page for a single practice category. Shows the parent domain and its
 * sibling categories for lateral movement, then lists the category's modules
 * grouped into difficulty bands (the third navigation level).
 */
export default function CategoryPage() {
  const { slug = '' } = useParams();
  const category = getCategoryBySlug(slug);

  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  const modules = useMemo(() => (category ? getModulesByCategory(category) : []), [category]);
  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q)),
    );
  }, [modules, debounced]);

  if (!category) {
    return (
      <PageContainer>
        <PageHeader title="Category not found" description="That category does not exist." />
        <Button asChild variant="outline">
          <Link to="/modules" data-testid="category-back">
            <ArrowLeft className="h-4 w-4" /> Back to modules
          </Link>
        </Button>
      </PageContainer>
    );
  }

  const Icon = modules[0]?.icon;
  const domain = getDomainForCategory(category);
  const siblings = domain ? domain.categories : [category];
  const bands = groupByDifficulty(filtered);
  const searching = debounced.trim().length > 0;

  // Prev/next within the domain for tight lateral movement.
  const idx = siblings.indexOf(category);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : undefined;

  return (
    <PageContainer>
      <Link
        to="/modules"
        data-testid="category-back"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All practice modules
      </Link>

      <PageHeader
        title={category}
        description={CATEGORY_DESCRIPTIONS[category]}
        icon={Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : undefined}
        actions={
          <Badge variant="secondary" className="rounded-full" data-testid="category-count">
            {modules.length} {modules.length === 1 ? 'module' : 'modules'}
          </Badge>
        }
      />

      {/* Domain context + sibling categories */}
      {domain ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card/50 p-3" data-testid="category-domain">
          <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', domain.accent)}>
            <domain.icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-foreground">{domain.label}</span>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex flex-wrap gap-1.5">
            {siblings.map((c) => (
              <Link
                key={c}
                to={`/category/${categorySlug(c)}`}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                  c === category
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Filter ${category}…`}
          aria-label={`Filter ${category}`}
          data-testid="category-search"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          No modules match “{debounced}”.
        </p>
      ) : searching ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="category-grid">
          {filtered.map((module, i) => (
            <ScrollReveal key={module.id} delay={i * 0.04}>
              <ModuleCard module={module} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="space-y-6" data-testid="category-grid">
          {bands.map((band) => (
            <div key={band.level} className="space-y-3" data-testid={`category-band-${band.level}`}>
              <div className="flex items-center gap-2 border-b pb-2">
                <LevelPill level={band.level} />
                <span className="text-xs text-muted-foreground">
                  {band.modules.length} {band.modules.length === 1 ? 'module' : 'modules'}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {band.modules.map((module, i) => (
                  <ScrollReveal key={module.id} delay={i * 0.04}>
                    <ModuleCard module={module} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Move between sibling categories in this domain */}
      <nav aria-label="Adjacent categories" className="flex items-center justify-between gap-3 border-t pt-6">
        {prev ? (
          <Button asChild variant="ghost" className="gap-2">
            <Link to={`/category/${categorySlug(prev)}`} data-testid="category-prev">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{prev}</span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="ghost" className="gap-2">
            <Link to={`/category/${categorySlug(next)}`} data-testid="category-next">
              <span className="truncate">{next}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </nav>
    </PageContainer>
  );
}
