import { useMemo, useState } from 'react';
import { ToggleRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Settings {
  notifications: boolean;
  email: boolean;
  sms: boolean;
  marketing: boolean;
}

export default function SwitchesPage() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    email: true,
    sms: false,
    marketing: false,
  });

  const set = (key: keyof Settings, value: boolean) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  // Email/SMS depend on the master "notifications" switch being on.
  const channelsDisabled = !settings.notifications;

  const result = useMemo(() => JSON.stringify(settings), [settings]);
  const activeCount = Object.values(settings).filter(Boolean).length;

  const ROWS: { key: keyof Settings; label: string; hint: string; disabled?: boolean }[] = [
    { key: 'notifications', label: 'Enable notifications', hint: 'Master switch for all channels.' },
    { key: 'email', label: 'Email alerts', hint: 'Requires notifications to be on.', disabled: channelsDisabled },
    { key: 'sms', label: 'SMS alerts', hint: 'Requires notifications to be on.', disabled: channelsDisabled },
    { key: 'marketing', label: 'Marketing emails', hint: 'Independent opt-in.' },
  ];

  return (
    <PageContainer>
      <PageHeader
        icon={<ToggleRight className="h-5 w-5" />}
        title="Toggle Switches"
        description="Independent and dependent switches, a master toggle that disables its child channels, and a permanently disabled control."
      />

      <Section title="Notification settings" id="settings" description="Turning off the master switch disables the email and SMS channels.">
        <Card>
          <CardContent className="divide-y divide-border pt-2">
            {ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <Label htmlFor={`switch-${row.key}`} className="font-medium">
                    {row.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{row.hint}</p>
                </div>
                <Switch
                  id={`switch-${row.key}`}
                  data-testid={`switch-${row.key}`}
                  checked={settings[row.key]}
                  disabled={row.disabled}
                  onCheckedChange={(value) => set(row.key, value)}
                  aria-label={row.label}
                />
              </div>
            ))}

            <div className="flex items-center justify-between gap-4 py-4 opacity-70">
              <div>
                <Label htmlFor="switch-locked" className="font-medium">
                  Beta features
                </Label>
                <p className="text-xs text-muted-foreground">Locked for your plan (always disabled).</p>
              </div>
              <Switch id="switch-locked" data-testid="switch-locked" checked={false} disabled aria-label="Beta features" />
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Active switches" value={activeCount} testId="switch-active-count" tone="success" />
          <ResultPanel label="State" value={result} testId="switch-result" />
        </div>
      </Section>
    </PageContainer>
  );
}
