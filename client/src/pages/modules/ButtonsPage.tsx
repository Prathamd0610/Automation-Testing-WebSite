import { useEffect, useRef, useState } from 'react';
import { MousePointerClick } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function ButtonsPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toggled, setToggled] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const startLoading = () => {
    setLoading(true);
    setLastAction('async-start');
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setLastAction('async-complete');
    }, 1500);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<MousePointerClick className="h-5 w-5" />}
        title="Buttons"
        description="Click, double-click, right-click, async loading and toggle button behaviours."
      />

      <Section title="Click events" id="clicks">
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <Button
              data-testid="btn-click"
              onClick={() => {
                setClickCount((c) => c + 1);
                setLastAction('single-click');
              }}
            >
              Single click
            </Button>
            <Button
              variant="secondary"
              data-testid="btn-double-click"
              onDoubleClick={() => setLastAction('double-click')}
            >
              Double click
            </Button>
            <Button
              variant="outline"
              data-testid="btn-right-click"
              onContextMenu={(event) => {
                event.preventDefault();
                setLastAction('right-click');
              }}
            >
              Right click
            </Button>
            <Button variant="ghost" disabled data-testid="btn-disabled">
              Disabled
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Async & toggle" id="async">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <Button onClick={startLoading} disabled={loading} data-testid="btn-async">
              {loading ? <Spinner label="Processing" /> : 'Start async task'}
            </Button>
            <Button
              variant={toggled ? 'success' : 'outline'}
              aria-pressed={toggled}
              data-testid="btn-toggle"
              onClick={() => {
                setToggled((t) => !t);
                setLastAction(`toggle-${!toggled ? 'on' : 'off'}`);
              }}
            >
              {toggled ? 'Enabled' : 'Disabled'}
            </Button>
          </CardContent>
        </Card>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel label="Last action" value={lastAction} testId="btn-last-action" tone="success" />
        <ResultPanel label="Total clicks" value={clickCount} testId="btn-click-count" />
      </div>
    </PageContainer>
  );
}
