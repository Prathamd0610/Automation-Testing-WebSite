import { useEffect, useRef, useState } from 'react';
import { ChevronsDown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const INITIAL = 20;
const STEP = 20;
const MAX = 120;

export default function InfiniteScrollPage() {
  const [count, setCount] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadTimer = useRef<number>();

  useEffect(() => () => window.clearTimeout(loadTimer.current), []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || count >= MAX) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !loading) {
          setLoading(true);
          loadTimer.current = window.setTimeout(() => {
            setCount((current) => Math.min(current + STEP, MAX));
            setLoading(false);
          }, 600);
        }
      },
      { rootMargin: '120px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [count, loading]);

  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <PageContainer>
      <PageHeader
        icon={<ChevronsDown className="h-5 w-5" />}
        title="Infinite Scroll"
        description="Items load in batches of 20 as a sentinel scrolls into view, up to 120 total."
      />

      <Section title="Feed" id="feed">
        <div className="mb-3 text-sm text-muted-foreground">
          Loaded <span className="font-semibold text-foreground" data-testid="scroll-count">{count}</span> of {MAX}
        </div>
        <div className="space-y-2">
          {items.map((index) => (
            <Card key={index} data-testid={`scroll-item-${index}`}>
              <CardContent className="flex items-center justify-between py-4">
                <span className="text-sm font-medium text-foreground">Item #{index + 1}</span>
                <span className="text-xs text-muted-foreground">Row {index + 1}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {count < MAX ? (
          <div ref={sentinelRef} className="flex justify-center py-6" data-testid="scroll-sentinel">
            {loading ? (
              <span data-testid="scroll-loader">
                <Spinner label="Loading more items" />
              </span>
            ) : null}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground" data-testid="scroll-end">
            You have reached the end of the list.
          </p>
        )}
      </Section>
    </PageContainer>
  );
}
