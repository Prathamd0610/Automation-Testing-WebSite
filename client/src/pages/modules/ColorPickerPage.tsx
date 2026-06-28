import { useState } from 'react';
import { Palette } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const SWATCHES = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed', '#0d9488', '#db2777', '#111827'];

/** Best-effort black/white text colour for contrast on a hex background. */
function readableText(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '#000';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

/**
 * Colour picker — the native colour input, a hex text field and preset
 * swatches, all kept in sync. Good practice for reading computed styles and
 * driving an `input[type=color]`.
 */
export default function ColorPickerPage() {
  const [color, setColor] = useState('#2563eb');
  const valid = /^#[0-9a-fA-F]{6}$/.test(color);

  return (
    <PageContainer>
      <PageHeader
        icon={<Palette className="h-5 w-5" />}
        title="Colour Picker"
        description="Pick a colour three ways — native picker, hex field or swatch — and watch the live preview and contrast text update together."
      />

      <Section title="Choose a colour" id="picker">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="color-native">Native picker</Label>
                <Input
                  id="color-native"
                  type="color"
                  value={valid ? color : '#000000'}
                  data-testid="color-native"
                  onChange={(e) => setColor(e.target.value)}
                  className="h-11 w-20 cursor-pointer p-1"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color-hex">Hex value</Label>
                <Input
                  id="color-hex"
                  value={color}
                  data-testid="color-hex"
                  spellCheck={false}
                  onChange={(e) => setColor(e.target.value)}
                  className={cn('w-36 font-mono', !valid && 'border-destructive')}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2" data-testid="color-swatches">
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  data-testid={`swatch-${s.replace('#', '')}`}
                  aria-label={`Select ${s}`}
                  onClick={() => setColor(s)}
                  className={cn(
                    'h-9 w-9 rounded-full border-2 transition-transform hover:scale-110',
                    color.toLowerCase() === s ? 'border-foreground' : 'border-transparent',
                  )}
                  style={{ backgroundColor: s }}
                />
              ))}
            </div>

            <div
              className="flex h-24 items-center justify-center rounded-xl border text-sm font-semibold"
              data-testid="color-preview"
              style={{ backgroundColor: valid ? color : '#fff', color: valid ? readableText(color) : '#000' }}
            >
              {valid ? `Sample text on ${color.toUpperCase()}` : 'Enter a valid #RRGGBB hex'}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Selected" value={color.toUpperCase()} testId="color-value" tone={valid ? 'success' : 'danger'} />
          <ResultPanel label="Contrast text" value={valid ? readableText(color) : ''} testId="color-contrast" />
        </div>
      </Section>
    </PageContainer>
  );
}
