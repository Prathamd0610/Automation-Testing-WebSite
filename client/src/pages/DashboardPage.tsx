import { useMemo, useState } from 'react';
import { Search, FlaskConical, Layers, Boxes, Workflow } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ModuleCard } from '@/components/common/ModuleCard';
import { AdSlot } from '@/components/common/AdSlot';
import { MODULES, MODULE_CATEGORIES, searchModules } from '@/config/modules';
import { useDebounce } from '@/hooks/useDebounce';

const STATS = [
  { label: 'Practice modules', value: MODULES.length, icon: Boxes },
  { label: 'Categories', value: MODULE_CATEGORIES.length, icon: Layers },
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
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);
  const results = useMemo(() => searchModules(debounced), [debounced]);
  const grouped = useMemo(
    () =>
      MODULE_CATEGORIES.map((category) => ({
        category,
        modules: results.filter((m) => m.category === category),
      })).filter((group) => group.modules.length > 0),
    [results],
  );

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-8">
        <Badge variant="secondary" className="mb-4">
          MERN · TypeScript · WCAG 2.1 AA
        </Badge>
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Practice UI &amp; API automation in one safe, realistic sandbox.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every control ships with stable <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data-testid</code>{' '}
          hooks and accessible semantics — perfect for Selenium, Cypress and Playwright.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border bg-card/70 p-4">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-2 text-2xl font-bold text-foreground" data-testid={`stat-${label}`}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
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
          placeholder="Filter modules by name or tag…"
          aria-label="Filter modules"
          data-testid="dashboard-search"
          className="pl-9"
        />
      </div>

      {grouped.length === 0 ? (
        <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          No modules match “{debounced}”.
        </p>
      ) : (
        grouped.map(({ category, modules }) => (
          <section key={category} className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </section>
        ))
      )}

      <AdSlot slot="1111111111" testId="ad-dashboard-bottom" />
    </div>
  );
}
