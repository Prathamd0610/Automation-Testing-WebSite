import { useState } from 'react';
import { Network } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { apiClient, getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';

const DELAY_MS = 1200;

export default function AjaxPage() {
  const [delayResult, setDelayResult] = useState<string | null>(null);
  const [randomResult, setRandomResult] = useState<string | null>(null);
  const [loadingDelay, setLoadingDelay] = useState<boolean>(false);
  const [loadingRandom, setLoadingRandom] = useState<boolean>(false);

  const loadDelayed = async (): Promise<void> => {
    setLoadingDelay(true);
    try {
      const { data } = await apiClient.get<unknown>(`/playground/delay/${DELAY_MS}`);
      setDelayResult(JSON.stringify(data, null, 2));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load delayed data'));
    } finally {
      setLoadingDelay(false);
    }
  };

  const loadRandom = async (): Promise<void> => {
    setLoadingRandom(true);
    try {
      const { data } = await apiClient.get<unknown>('/playground/random');
      setRandomResult(JSON.stringify(data, null, 2));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Random endpoint failed'));
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Network className="h-5 w-5" />}
        title="AJAX Data"
        description="Fire asynchronous requests and assert on the rendered JSON once each call resolves."
      />

      <Section title="Delayed request" id="ajax-delay">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Button onClick={loadDelayed} disabled={loadingDelay} data-testid="ajax-load" aria-busy={loadingDelay}>
              {loadingDelay ? <Spinner label="Loading delayed data" /> : `Load delayed data (${DELAY_MS} ms)`}
            </Button>
            <pre
              data-testid="ajax-result"
              aria-live="polite"
              className="max-h-72 overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground"
            >
              {delayResult ?? '—'}
            </pre>
          </CardContent>
        </Card>
      </Section>

      <Section title="Randomized request" id="ajax-random">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Button
              variant="secondary"
              onClick={loadRandom}
              disabled={loadingRandom}
              data-testid="ajax-random-load"
              aria-busy={loadingRandom}
            >
              {loadingRandom ? <Spinner label="Loading random data" /> : 'Load random data'}
            </Button>
            <pre
              data-testid="ajax-random"
              aria-live="polite"
              className="max-h-72 overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground"
            >
              {randomResult ?? '—'}
            </pre>
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
