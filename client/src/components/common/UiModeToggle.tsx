import { useUiMode } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

/**
 * A clear segmented "Classic | Modern" switch for swapping the UI skin.
 * Replaces the ambiguous icon toggle so the action is self-explanatory.
 */
export function UiModeToggle({ className }: { className?: string }) {
  const { uiMode, toggleUiMode } = useUiMode();
  const isModern = uiMode === 'modern';

  return (
    <button
      type="button"
      onClick={toggleUiMode}
      role="switch"
      aria-checked={isModern}
      aria-label={isModern ? 'Switch to classic UI' : 'Switch to modern UI'}
      title={isModern ? 'Switch to classic UI' : 'Switch to modern UI'}
      data-testid="ui-mode-toggle"
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-muted/40 p-0.5 text-xs font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          !isModern ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
        )}
      >
        Classic
      </span>
      <span
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          isModern ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground',
        )}
      >
        Modern
      </span>
    </button>
  );
}
