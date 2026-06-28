import { useState } from 'react';
import { Minus, Plus, Calculator } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MIN = 0;
const MAX = 10;
const PRICE = 19.99;

/**
 * Quantity stepper — increment/decrement with min/max bounds and a live total.
 * The buttons disable at the limits, so tests should assert the disabled state
 * rather than clicking blindly.
 */
export default function StepperPage() {
  const [qty, setQty] = useState(1);

  const clamp = (n: number) => Math.max(MIN, Math.min(MAX, n));

  return (
    <PageContainer>
      <PageHeader
        icon={<Calculator className="h-5 w-5" />}
        title="Quantity Stepper"
        description={`Increase or decrease the quantity between ${MIN} and ${MAX}. The total recalculates instantly and the buttons disable at the bounds.`}
      />

      <Section title="Add to cart" id="stepper">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                aria-label="Decrease quantity"
                data-testid="stepper-decrement"
                disabled={qty <= MIN}
                onClick={() => setQty((q) => clamp(q - 1))}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </Button>
              <input
                type="number"
                value={qty}
                min={MIN}
                max={MAX}
                aria-label="Quantity"
                data-testid="stepper-value-input"
                onChange={(e) => setQty(clamp(Number(e.target.value) || 0))}
                className="h-11 w-20 rounded-lg border bg-background text-center text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                size="icon"
                variant="outline"
                aria-label="Increase quantity"
                data-testid="stepper-increment"
                disabled={qty >= MAX}
                onClick={() => setQty((q) => clamp(q + 1))}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Unit price ${PRICE.toFixed(2)} · {MAX} max per order
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Quantity" value={qty} testId="stepper-qty" tone="success" />
          <ResultPanel label="Total" value={`$${(qty * PRICE).toFixed(2)}`} testId="stepper-total" />
        </div>
      </Section>
    </PageContainer>
  );
}
