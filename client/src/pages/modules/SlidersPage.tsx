import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

const THUMB_CLASS =
  'block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

export default function SlidersPage() {
  const [single, setSingle] = useState(50);
  const [stepped, setStepped] = useState(30);
  const [range, setRange] = useState<number[]>([200, 800]);

  const rangeMin = range[0] ?? 0;
  const rangeMax = range[1] ?? 0;

  return (
    <PageContainer>
      <PageHeader
        icon={<SlidersHorizontal className="h-5 w-5" />}
        title="Sliders & Range"
        description="Continuous, stepped and dual-thumb range sliders with live values."
      />

      <Section title="Single slider" id="single" description="Continuous 0–100 range.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Label htmlFor="slider-single">Volume</Label>
            <Slider
              id="slider-single"
              data-testid="slider-single"
              value={[single]}
              onValueChange={(value) => setSingle(value[0] ?? 0)}
              min={0}
              max={100}
              step={1}
              aria-label="Volume"
            />
            <ResultPanel label="Current value" value={single} testId="slider-single-value" tone="success" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Stepped slider" id="stepped" description="Snaps to increments of 10.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Label htmlFor="slider-stepped">Brightness</Label>
            <Slider
              id="slider-stepped"
              data-testid="slider-stepped"
              value={[stepped]}
              onValueChange={(value) => setStepped(value[0] ?? 0)}
              min={0}
              max={100}
              step={10}
              aria-label="Brightness"
            />
            <ResultPanel label="Current step" value={stepped} testId="slider-stepped-value" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Range slider" id="range" description="Two thumbs produce a [min, max] price range.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Label htmlFor="slider-range">Price range</Label>
            <SliderPrimitive.Root
              id="slider-range"
              data-testid="slider-range"
              className="relative flex w-full touch-none select-none items-center"
              value={range}
              onValueChange={setRange}
              min={0}
              max={1000}
              step={10}
              minStepsBetweenThumbs={1}
              aria-label="Price range"
            >
              <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className={THUMB_CLASS} aria-label="Minimum price" />
              <SliderPrimitive.Thumb className={THUMB_CLASS} aria-label="Maximum price" />
            </SliderPrimitive.Root>
            <ResultPanel
              label="Selected range"
              value={`${formatCurrency(rangeMin)} – ${formatCurrency(rangeMax)}`}
              testId="slider-range-value"
              tone="success"
            />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
