import { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

/** Generates a short, URL-safe token used to mimic server-rendered volatile ids. */
function randomToken(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function DynamicIdsPage() {
  const [buttonId, setButtonId] = useState<string>(() => `field-${randomToken()}`);
  const [inputId, setInputId] = useState<string>(() => `field-${randomToken()}`);

  const regenerate = (): void => {
    setButtonId(`field-${randomToken()}`);
    setInputId(`field-${randomToken()}`);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Fingerprint className="h-5 w-5" />}
        title="Dynamic IDs"
        description="The id and name attributes change on every regenerate, but the data-testid and visible text stay stable."
      />

      <Section title="Volatile attributes" id="dynamic">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button data-testid="regenerate-ids" onClick={regenerate}>
                Regenerate
              </Button>
              <p className="text-sm text-muted-foreground">
                Each click randomizes the underlying id and name attributes.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={inputId}>Search field</Label>
                <Input
                  id={inputId}
                  name={inputId}
                  data-testid="dynamic-input"
                  placeholder="Stable testid, volatile id"
                  aria-label="Search field with a dynamic id"
                />
                <p className="break-all font-mono text-xs text-muted-foreground" data-testid="dynamic-input-id">
                  id / name: {inputId}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={buttonId}>Submit control</Label>
                <Button
                  id={buttonId}
                  name={buttonId}
                  type="button"
                  variant="secondary"
                  data-testid="dynamic-button"
                  className="w-full"
                >
                  Submit search
                </Button>
                <p className="break-all font-mono text-xs text-muted-foreground" data-testid="dynamic-button-id">
                  id / name: {buttonId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Locator guidance" id="guidance">
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm text-muted-foreground">
            <p>
              Ids and names here are regenerated on every render cycle, so a locator like
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">#field-abc1234</code>
              breaks the moment you click Regenerate.
            </p>
            <p>
              Prefer resilient locators such as the stable
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">data-testid</code>
              or visible text (&ldquo;Submit search&rdquo;) instead of the volatile id.
            </p>
          </CardContent>
        </Card>
      </Section>

      <ResultPanel label="Current generated id" value={buttonId} testId="current-id" />
    </PageContainer>
  );
}
