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
import {
  MODULE_CATEGORIES,
  getModulesByCategory,
  getCategoryBySlug,
  categorySlug,
  CATEGORY_DESCRIPTIONS,
} from '@/config/modules';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Landing page for a single module category. Lets the user browse and pick a
 * module within the category instead of scrolling the dashboard. Shared by both
 * the classic and modern shells.
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
          <Link to="/" data-testid="category-back">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
        </Button>
      </PageContainer>
    );
  }

  const Icon = modules[0]?.icon;
  const index = MODULE_CATEGORIES.indexOf(category);
  const prev = index > 0 ? MODULE_CATEGORIES[index - 1] : undefined;
  const next = index < MODULE_CATEGORIES.length - 1 ? MODULE_CATEGORIES[index + 1] : undefined;

  return (
    <PageContainer>
      <Link
        to="/"
        data-testid="category-back"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All categories
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="category-grid">
          {filtered.map((module, i) => (
            <ScrollReveal key={module.id} delay={i * 0.04}>
              <ModuleCard module={module} />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Jump to an adjacent category */}
      <nav
        aria-label="Adjacent categories"
        className="flex items-center justify-between gap-3 border-t pt-6"
      >
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
