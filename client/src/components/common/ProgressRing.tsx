import { cn } from '@/lib/utils';

interface ProgressRingProps {
  /** 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Show the numeric percentage in the middle. */
  showLabel?: boolean;
  label?: string;
}

/**
 * A compact circular progress indicator used in navigation (track completion,
 * overall learning progress). Purely presentational and theme-aware.
 */
export function ProgressRing({
  value,
  size = 28,
  strokeWidth = 3,
  className,
  showLabel = false,
  label,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const complete = clamped >= 100;

  return (
    <span
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-[stroke-dashoffset] duration-500', complete ? 'stroke-emerald-500' : 'stroke-primary')}
        />
      </svg>
      {showLabel ? (
        <span className="absolute text-[9px] font-bold tabular-nums text-foreground">{clamped}</span>
      ) : null}
    </span>
  );
}
