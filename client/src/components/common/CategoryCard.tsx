import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  getModulesByCategory,
  categorySlug,
  CATEGORY_DESCRIPTIONS,
  type ModuleCategory,
} from '@/config/modules';
import { cn } from '@/lib/utils';

/** A card that links to a category's landing page. Shared across dashboards. */
export function CategoryCard({ category }: { category: ModuleCategory }) {
  const modules = getModulesByCategory(category);
  const Icon = modules[0]?.icon;
  const slug = categorySlug(category);
  return (
    <Link
      to={`/category/${slug}`}
      data-testid={`category-card-${slug}`}
      className={cn(
        'group relative flex h-full flex-col gap-3 rounded-xl border bg-card p-5 shadow-card transition-all',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-apple-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="flex items-start justify-between">
        <span className="brand-icon flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
        </span>
        <Badge variant="secondary" className="rounded-full">
          {modules.length}
        </Badge>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{category}</h3>
        <p className="text-sm text-muted-foreground">{CATEGORY_DESCRIPTIONS[category]}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open category <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
