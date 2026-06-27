import { useMemo, useState } from 'react';
import { GalleryHorizontalEnd, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ITEMS = Array.from({ length: 47 }, (_, i) => `Catalog item #${String(i + 1).padStart(2, '0')}`);
const PAGE_SIZES = [5, 10, 20];

export default function PaginationPage() {
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(ITEMS.length / pageSize);
  const start = (page - 1) * pageSize;
  const pageItems = useMemo(() => ITEMS.slice(start, start + pageSize), [start, pageSize]);

  const goTo = (next: number) => setPage(Math.min(Math.max(1, next), totalPages));

  const changeSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  // Render a compact window of page numbers around the current page.
  const windowPages = useMemo(() => {
    const span = 2;
    const from = Math.max(1, page - span);
    const to = Math.min(totalPages, page + span);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [page, totalPages]);

  return (
    <PageContainer>
      <PageHeader
        icon={<GalleryHorizontalEnd className="h-5 w-5" />}
        title="Pagination"
        description="A paged list with first/previous/next/last controls, numbered pages and a page-size selector that resets to page one."
      />

      <Section title="Catalog" id="list" description={`Showing ${pageItems.length} of ${ITEMS.length} items.`}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" data-testid="page-summary">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="page-size" className="text-xs text-muted-foreground">
                  Per page
                </label>
                <select
                  id="page-size"
                  data-testid="page-size"
                  value={pageSize}
                  onChange={(e) => changeSize(Number(e.target.value))}
                  className="h-9 rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="divide-y divide-border rounded-lg border" data-testid="page-items">
              {pageItems.map((item) => (
                <li key={item} className="px-4 py-2.5 text-sm" data-testid="page-item">
                  {item}
                </li>
              ))}
            </ul>

            <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
              <Button variant="outline" size="sm" data-testid="page-first" disabled={page === 1} onClick={() => goTo(1)}>
                First
              </Button>
              <Button variant="outline" size="icon" data-testid="page-prev" disabled={page === 1} onClick={() => goTo(page - 1)} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {windowPages.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="icon"
                  data-testid={`page-${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn(p === page && 'pointer-events-none')}
                  onClick={() => goTo(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="icon" data-testid="page-next" disabled={page === totalPages} onClick={() => goTo(page + 1)} aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" data-testid="page-last" disabled={page === totalPages} onClick={() => goTo(totalPages)}>
                Last
              </Button>
            </nav>
          </CardContent>
        </Card>
        <ResultPanel
          label="Current page"
          value={`${page}/${totalPages} · items ${start + 1}-${start + pageItems.length}`}
          testId="pagination-result"
          tone="success"
        />
      </Section>
    </PageContainer>
  );
}
