import { cn } from '@/lib/utils';

interface ResultPanelProps {
  /** A label shown above the value, e.g. "Last action". */
  label: string;
  /** The current value to display; rendered into a stable testid target. */
  value: string | number | null | undefined;
  testId: string;
  className?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

const toneClasses: Record<NonNullable<ResultPanelProps['tone']>, string> = {
  default: 'border-border bg-muted/40 text-foreground',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
};

/**
 * A consistent, automation-friendly output region. Every page uses this so
 * tests can assert on a predictable `data-testid` + `aria-live` surface.
 */
export function ResultPanel({ label, value, testId, className, tone = 'default' }: ResultPanelProps) {
  return (
    <div
      className={cn('rounded-lg border px-4 py-3 text-sm', toneClasses[tone], className)}
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-medium" data-testid={testId}>
        {value === null || value === undefined || value === '' ? '—' : String(value)}
      </p>
    </div>
  );
}
