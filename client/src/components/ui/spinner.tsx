import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
      <Loader2 className={cn('h-4 w-4 animate-spin text-primary', className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
