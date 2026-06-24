import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AlertsPage() {
  const [confirmResult, setConfirmResult] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  const handleAlert = () => {
    window.alert('This is a native browser alert dialog.');
  };

  const handleConfirm = () => {
    const result = window.confirm('Do you want to proceed?');
    setConfirmResult(String(result));
  };

  const handlePrompt = () => {
    const result = window.prompt('Enter your name:', '');
    setPromptResult(result);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Alerts & Popups"
        description="Native alert, confirm and prompt dialogs plus a modern non-blocking popup alternative."
      />

      <Section title="Native dialogs" id="native" description="Browser-managed dialogs that block the main thread.">
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <Button onClick={handleAlert} data-testid="btn-alert">
              Show alert
            </Button>
            <Button variant="secondary" onClick={handleConfirm} data-testid="btn-confirm">
              Show confirm
            </Button>
            <Button variant="outline" onClick={handlePrompt} data-testid="btn-prompt">
              Show prompt
            </Button>
          </CardContent>
        </Card>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel label="Confirm result" value={confirmResult} testId="confirm-result" tone="success" />
        <ResultPanel label="Prompt result" value={promptResult} testId="prompt-result" />
      </div>

      <Section title="Custom popup" id="custom" description="A non-native dialog you can fully style and test in the DOM.">
        <Card>
          <CardContent className="pt-6">
            <Button onClick={() => setCustomOpen(true)} data-testid="btn-custom-popup">
              Open custom popup
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent data-testid="custom-popup">
          <DialogHeader>
            <DialogTitle>Custom popup</DialogTitle>
            <DialogDescription>
              Unlike native dialogs, this popup lives in the DOM so it is easy to assert on and style.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button data-testid="custom-popup-close">Got it</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
