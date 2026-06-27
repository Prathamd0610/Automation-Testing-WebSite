import { useMemo, useState } from 'react';
import { ListFilter, Search, X } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

interface Product {
  name: string;
  category: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { name: 'Aero Wireless Mouse', category: 'Accessories', price: 29 },
  { name: 'Nimbus Mechanical Keyboard', category: 'Accessories', price: 89 },
  { name: 'Vortex 27" Monitor', category: 'Displays', price: 249 },
  { name: 'Lumen LED Desk Lamp', category: 'Office', price: 39 },
  { name: 'Pulse Noise-Cancelling Headphones', category: 'Audio', price: 199 },
  { name: 'Echo Bluetooth Speaker', category: 'Audio', price: 59 },
  { name: 'Strata Standing Desk', category: 'Office', price: 379 },
  { name: 'Quartz 4K Webcam', category: 'Accessories', price: 79 },
  { name: 'Helix USB-C Hub', category: 'Accessories', price: 45 },
  { name: 'Cirrus Ultrawide Monitor', category: 'Displays', price: 449 },
  { name: 'Onyx Ergonomic Chair', category: 'Office', price: 299 },
  { name: 'Sonic Studio Microphone', category: 'Audio', price: 129 },
];

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
const SORTS = [
  { id: 'name-asc', label: 'Name (A–Z)' },
  { id: 'name-desc', label: 'Name (Z–A)' },
  { id: 'price-asc', label: 'Price (low → high)' },
  { id: 'price-desc', label: 'Price (high → low)' },
] as const;

export default function SearchFilterPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('name-asc');
  const debounced = useDebounce(query, 200);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    const rows = PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (q === '' || p.name.toLowerCase().includes(q)),
    );
    const sorted = [...rows].sort((a, b) => {
      switch (sort) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [debounced, category, sort]);

  const clear = () => {
    setQuery('');
    setCategory('All');
    setSort('name-asc');
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ListFilter className="h-5 w-5" />}
        title="Search & Filter"
        description="A live client-side product list: debounced search, a category filter, sorting and a result count that updates as you refine."
      />

      <Section title="Products" id="filter" description="Combine search, category and sort to narrow the list.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  data-testid="filter-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="pl-9"
                />
              </div>
              <select
                data-testid="filter-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                data-testid="filter-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label="Sort products"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground" data-testid="filter-count">
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </p>
              <Button variant="ghost" size="sm" data-testid="filter-clear" onClick={clear}>
                <X className="h-4 w-4" /> Clear
              </Button>
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground" data-testid="filter-empty">
                No products match your filters.
              </p>
            ) : (
              <ul className="divide-y divide-border rounded-lg border" data-testid="filter-results">
                {filtered.map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-3 px-4 py-2.5" data-testid={`product-row`}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                      <Badge variant="secondary" className="mt-0.5 rounded-full text-[10px]">{p.category}</Badge>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-foreground">${p.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <ResultPanel
          label="Filters"
          value={`${filtered.length} shown · category=${category} · sort=${sort}`}
          testId="search-filter-result"
          tone="success"
        />
      </Section>
    </PageContainer>
  );
}
