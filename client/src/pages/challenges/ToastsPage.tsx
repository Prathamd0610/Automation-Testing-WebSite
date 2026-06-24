import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const BANNER_TIMEOUT_MS = 3000;

export default function ToastsPage() {
  const [lastToast, setLastToast] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const fireSuccess = (): void => {
    toast.success('Operation completed successfully');
    setLastToast('success');
  };

  const fireError = (): void => {
    toast.error('Something went wrong');
    setLastToast('error');
  };

  const fireInfo = (): void => {
    toast.message('Here is some neutral information');
    setLastToast('message');
  };

  const showBanner = (): void => {
    setBannerVisible(true);
    setLastToast('custom-banner');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBannerVisible(false), BANNER_TIMEOUT_MS);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Bell className="h-5 w-5" />}
        title="Toast Notifications"
        description="Trigger library toasts and a custom in-page banner that auto-dismisses, then assert on transient UI."
      />

      <Section title="Library toasts" id="toasts">
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <Button variant="success" onClick={fireSuccess} data-testid="toast-success">
              Success toast
            </Button>
            <Button variant="destructive" onClick={fireError} data-testid="toast-error">
              Error toast
            </Button>
            <Button variant="outline" onClick={fireInfo} data-testid="toast-info">
              Info toast
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Custom transient banner" id="custom-banner">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Button onClick={showBanner} data-testid="show-custom-toast">
              Show custom banner
            </Button>
            {bannerVisible ? (
              <div
                role="status"
                aria-live="polite"
                data-testid="custom-toast"
                className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary shadow-card"
              >
                Custom banner — this auto-hides after {BANNER_TIMEOUT_MS / 1000}s.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Section>

      <ResultPanel label="Last toast type" value={lastToast} testId="last-toast" tone="success" />
    </PageContainer>
  );
}
