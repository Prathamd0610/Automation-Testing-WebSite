import { useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GRADIENTS = [
  'from-rose-400 to-orange-300',
  'from-sky-400 to-indigo-300',
  'from-emerald-400 to-teal-300',
  'from-fuchsia-400 to-purple-300',
  'from-amber-400 to-yellow-300',
  'from-cyan-400 to-blue-300',
];

interface Tile {
  id: number;
  gradient: string;
  loaded: boolean;
}

function makeTiles(start: number, count: number): Tile[] {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    gradient: GRADIENTS[(start + i) % GRADIENTS.length]!,
    loaded: false,
  }));
}

/**
 * Lazy-loaded image gallery — each tile starts as a skeleton and flips to a
 * "loaded" state after a short delay, mimicking real network image loads.
 * Automation should wait for `data-loaded="true"` rather than a fixed sleep.
 */
export default function LazyImagesPage() {
  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles(1, 6));

  useEffect(() => {
    const pending = tiles.filter((t) => !t.loaded);
    if (pending.length === 0) return;
    const timers = pending.map((t) =>
      window.setTimeout(
        () => setTiles((prev) => prev.map((x) => (x.id === t.id ? { ...x, loaded: true } : x))),
        400 + Math.random() * 1200,
      ),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [tiles]);

  const loadedCount = tiles.filter((t) => t.loaded).length;
  const loadMore = () => setTiles((prev) => [...prev, ...makeTiles(prev.length + 1, 3)]);

  return (
    <PageContainer>
      <PageHeader
        icon={<ImageIcon className="h-5 w-5" />}
        title="Lazy-Loaded Images"
        description="Tiles load asynchronously and flip to a loaded state. Wait for each tile's data-loaded flag instead of guessing a timeout."
      />

      <Section title="Gallery" id="gallery" description="Click “Load more” to append tiles that begin loading immediately.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="lazy-grid">
              {tiles.map((t) => (
                <div
                  key={t.id}
                  data-testid={`lazy-tile-${t.id}`}
                  data-loaded={t.loaded}
                  className="relative aspect-video overflow-hidden rounded-lg border"
                >
                  {t.loaded ? (
                    <div className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-semibold text-white', t.gradient)}>
                      #{t.id}
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted" data-testid={`lazy-skeleton-${t.id}`}>
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" data-testid="lazy-load-more" onClick={loadMore}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Load more
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Loaded" value={`${loadedCount} / ${tiles.length}`} testId="lazy-loaded-count" tone={loadedCount === tiles.length ? 'success' : 'warning'} />
          <ResultPanel label="All ready" value={loadedCount === tiles.length ? 'Yes' : 'Loading…'} testId="lazy-all-ready" />
        </div>
      </Section>
    </PageContainer>
  );
}
