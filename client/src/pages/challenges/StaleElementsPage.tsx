import { useEffect, useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const REPLACE_DELAY_MS = 1000;
const ROWS: readonly string[] = ['Row Alpha', 'Row Bravo', 'Row Charlie'];

export default function StaleElementsPage() {
  const [listKey, setListKey] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [replaced, setReplaced] = useState<boolean>(false);
  const [replacing, setReplacing] = useState<boolean>(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const rebuild = (): void => {
    setListKey((key) => key + 1);
    setReplaced(false);
  };

  const autoReplace = (): void => {
    setReplacing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setReplaced(true);
      setReplacing(false);
    }, REPLACE_DELAY_MS);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Layers className="h-5 w-5" />}
        title="Stale Elements"
        description="Remount the list to invalidate cached element references, then practice re-locating nodes that were swapped out."
      />

      <Section title="Remountable list" id="stale-list">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={rebuild} data-testid="rebuild">
                Rebuild list
              </Button>
              <Button variant="secondary" onClick={() => setCount((value) => value + 1)} data-testid="stale-counter">
                Counter clicks: {count}
              </Button>
            </div>

            <div key={listKey} data-testid="stale-list" className="space-y-2">
              {ROWS.map((row) => (
                <div
                  key={row}
                  data-build={listKey}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
                >
                  {row} · build #{listKey}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Auto-replacing node" id="auto-replace">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Button onClick={autoReplace} disabled={replacing} data-testid="auto-replace" aria-busy={replacing}>
              {replacing ? <Spinner label="Replacing content" /> : 'Replace content in 1s'}
            </Button>
            <div
              data-testid="replaced-content"
              aria-live="polite"
              className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
            >
              {replaced
                ? 'Replaced content — any reference captured before this swap is now stale.'
                : 'Original content (waiting to be replaced).'}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Why references go stale" id="guidance">
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm text-muted-foreground">
            <p>
              Clicking <strong>Rebuild list</strong> changes the React key of the container, forcing a full remount.
              The previous DOM nodes are detached, so a cached reference throws a
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">StaleElementReferenceException</code>.
            </p>
            <p>Re-find the element after any rebuild or content swap instead of reusing an old handle.</p>
          </CardContent>
        </Card>
      </Section>

      <ResultPanel label="Current build" value={listKey} testId="stale-build" />
    </PageContainer>
  );
}
