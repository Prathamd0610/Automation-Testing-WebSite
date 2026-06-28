import { useRef, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LENGTH = 6;
const CORRECT = '123456';

/**
 * One-time-password input — six single-character boxes that auto-advance,
 * support backspace navigation and full-code paste. A real-world auth widget
 * that needs careful keyboard + focus automation.
 */
export default function OtpInputPage() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');
  const complete = code.length === LENGTH;

  const setAt = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setStatus('idle');
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill('');
    pasted.split('').forEach((c, i) => (next[i] = c));
    setDigits(next);
    setStatus('idle');
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const verify = () => setStatus(code === CORRECT ? 'correct' : 'wrong');
  const reset = () => {
    setDigits(Array(LENGTH).fill(''));
    setStatus('idle');
    refs.current[0]?.focus();
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<KeyRound className="h-5 w-5" />}
        title="OTP / Verification Code"
        description="Six auto-advancing boxes with backspace navigation and paste support. The correct code is 123456."
      />

      <Section title="Enter the code" id="otp" description="Type, paste the whole code, or use backspace to move back.">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex gap-2" data-testid="otp-inputs">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  data-testid={`otp-${i}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) => setAt(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onPaste={onPaste}
                  className={cn(
                    'h-14 w-12 rounded-lg border bg-background text-center text-2xl font-semibold',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    status === 'wrong' && 'border-destructive',
                    status === 'correct' && 'border-success',
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button data-testid="otp-verify" disabled={!complete} onClick={verify}>
                Verify
              </Button>
              <Button variant="outline" data-testid="otp-reset" onClick={reset}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Code" value={code} testId="otp-value" />
          <ResultPanel
            label="Status"
            value={status === 'idle' ? 'Awaiting verification' : status === 'correct' ? 'Verified ✓' : 'Incorrect code'}
            testId="otp-status"
            tone={status === 'correct' ? 'success' : status === 'wrong' ? 'danger' : 'default'}
          />
        </div>
      </Section>
    </PageContainer>
  );
}
