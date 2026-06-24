import { useMemo, useState } from 'react';
import { CircleDot } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

const SHIPPING_OPTIONS = [
  { value: 'standard', label: 'Standard (5-7 days)', price: 0 },
  { value: 'express', label: 'Express (2-3 days)', price: 9.99 },
  { value: 'overnight', label: 'Overnight (1 day)', price: 24.99 },
] as const;

const CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'other', label: 'Other' },
] as const;

export default function RadiosPage() {
  const [shipping, setShipping] = useState('standard');
  const [contact, setContact] = useState('email');
  const [otherContact, setOtherContact] = useState('');

  const selectedShipping = useMemo(
    () => SHIPPING_OPTIONS.find((option) => option.value === shipping) ?? null,
    [shipping],
  );

  return (
    <PageContainer>
      <PageHeader
        icon={<CircleDot className="h-5 w-5" />}
        title="Radio Buttons"
        description="Single-choice groups with pricing and a conditionally revealed input."
      />

      <Section title="Shipping method" id="shipping">
        <Card>
          <CardContent className="pt-6">
            <RadioGroup value={shipping} onValueChange={setShipping} data-testid="radio-shipping">
              {SHIPPING_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`shipping-${option.value}`}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-input p-3 font-normal"
                >
                  <span className="flex items-center gap-3">
                    <RadioGroupItem
                      id={`shipping-${option.value}`}
                      value={option.value}
                      data-testid={`radio-option-${option.value}`}
                    />
                    {option.label}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {option.price === 0 ? 'Free' : formatCurrency(option.price)}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </Section>

      <Section title="Contact preference" id="contact" description="Choosing “Other” reveals a free-text input.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <RadioGroup value={contact} onValueChange={setContact} data-testid="radio-contact">
              {CONTACT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-3">
                  <RadioGroupItem
                    id={`contact-${option.value}`}
                    value={option.value}
                    data-testid={`radio-option-${option.value}`}
                  />
                  <Label htmlFor={`contact-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {contact === 'other' ? (
              <div className="space-y-2">
                <Label htmlFor="radio-other-input">Tell us how to reach you</Label>
                <Input
                  id="radio-other-input"
                  data-testid="radio-other-input"
                  value={otherContact}
                  onChange={(event) => setOtherContact(event.target.value)}
                  placeholder="e.g. Slack, WhatsApp"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel
          label="Chosen shipping"
          value={
            selectedShipping
              ? `${selectedShipping.label} · ${selectedShipping.price === 0 ? 'Free' : formatCurrency(selectedShipping.price)}`
              : null
          }
          testId="radio-result"
          tone="success"
        />
        <ResultPanel
          label="Contact preference"
          value={contact === 'other' ? `other: ${otherContact || '—'}` : contact}
          testId="radio-contact-result"
        />
      </div>
    </PageContainer>
  );
}
