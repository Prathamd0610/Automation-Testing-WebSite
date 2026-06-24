import { useEffect, useRef, useState } from 'react';
import { Hourglass } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function DelayedLoadingPage() {
  const [delay, setDelay] = useState<number>(1500);
  const [loading, setLoading] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const load = (): void => {
    setRevealed(false);
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setRevealed(true);
    }, delay);
  };

  const status = loading ? 'loading' : revealed ? 'loaded' : 'idle';

  return (
    <PageContainer>
      <PageHeader
        icon={<Hourglass className="h-5 w-5" />}
        title="Delayed Loading"
        description="Trigger an artificial delay, watch the spinner, then assert on content that only appears after the timer resolves."
      />

      <Section title="Deferred content" id="delayed">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="delay-ms">Delay (ms)</Label>
                <Input
                  id="delay-ms"
                  type="number"
                  min={0}
                  step={100}
                  data-testid="delay-input"
                  value={delay}
                  onChange={(event) => setDelay(Math.max(0, Number(event.target.value) || 0))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={load} disabled={loading} data-testid="load-button" aria-busy={loading}>
                  {loading ? <Spinner label="Loading content" /> : 'Load content'}
                </Button>
              </div>
            </div>

            {loading ? (
              <div
                data-testid="delayed-spinner"
                role="status"
                aria-live="polite"
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
              >
                <Spinner label="Loading content" />
                <span>Loading content…</span>
              </div>
            ) : null}

            {revealed ? (
              <Card data-testid="delayed-content" className="border-success/30 bg-success/5">
                <CardContent className="pt-6 text-sm text-foreground">
                  Content loaded after {delay} ms. This block only mounts once the timer resolves, so your
                  test must wait for it rather than asserting immediately.
                </CardContent>
              </Card>
            ) : null}
          </CardContent>
        </Card>
      </Section>

      <ResultPanel label="Loading status" value={status} testId="delayed-status" tone={revealed ? 'success' : 'default'} />
    </PageContainer>
  );
}
