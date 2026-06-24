import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

export default function SpinnersPage() {
  const [blocking, setBlocking] = useState(false);
  const [blockingRevealed, setBlockingRevealed] = useState(false);
  const [inlineLoading, setInlineLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);

  const blockingTimer = useRef<number>();
  const inlineTimer = useRef<number>();
  const skeletonTimer = useRef<number>();

  useEffect(
    () => () => {
      window.clearTimeout(blockingTimer.current);
      window.clearTimeout(inlineTimer.current);
      window.clearTimeout(skeletonTimer.current);
    },
    [],
  );

  const startBlocking = () => {
    setBlocking(true);
    setBlockingRevealed(false);
    blockingTimer.current = window.setTimeout(() => {
      setBlocking(false);
      setBlockingRevealed(true);
    }, 2000);
  };

  const startInline = () => {
    setInlineLoading(true);
    inlineTimer.current = window.setTimeout(() => setInlineLoading(false), 1500);
  };

  const startSkeleton = () => {
    setSkeletonLoading(true);
    skeletonTimer.current = window.setTimeout(() => setSkeletonLoading(false), 1500);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<RefreshCw className="h-5 w-5" />}
        title="Loading Spinners"
        description="Blocking overlays, inline button spinners and skeleton placeholders for async waits."
      />

      <Section title="Blocking overlay" id="blocking" description="A full-card overlay blocks interaction for 2 seconds.">
        <Card className="relative overflow-hidden">
          <CardContent className="space-y-4 pt-6">
            <Button onClick={startBlocking} disabled={blocking} data-testid="load-blocking">
              Load content
            </Button>
            {blockingRevealed ? (
              <p className="text-sm text-muted-foreground" data-testid="blocking-content">
                Content loaded successfully after a 2 second block.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Click “Load content” to simulate a blocking fetch.</p>
            )}
          </CardContent>
          {blocking ? (
            <div
              className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
              data-testid="block-spinner"
              role="status"
              aria-live="polite"
            >
              <Spinner label="Loading content" className="h-6 w-6" />
            </div>
          ) : null}
        </Card>
      </Section>

      <Section title="Inline button spinner" id="inline" description="The button shows a spinner while a 1.5 second task runs.">
        <Card>
          <CardContent className="pt-6">
            <Button onClick={startInline} disabled={inlineLoading} data-testid="inline-spinner-btn">
              {inlineLoading ? <Spinner label="Running" /> : 'Run inline task'}
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Skeleton placeholders" id="skeleton" description="Reload swaps real content for skeletons for 1.5 seconds.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Button variant="outline" onClick={startSkeleton} disabled={skeletonLoading} data-testid="reload-skeleton">
              Reload
            </Button>
            {skeletonLoading ? (
              <div className="space-y-3" data-testid="skeleton-placeholder">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-2 text-sm text-foreground" data-testid="skeleton-content">
                <p className="font-medium">Profile summary</p>
                <p className="text-muted-foreground">Automation engineer focused on resilient end-to-end tests.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
