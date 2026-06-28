import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/common/ProgressRing';
import { useLearningProgress, useModuleProgress } from '@/hooks/useProgress';
import { useAppDispatch } from '@/store/hooks';
import { resetProgress } from '@/store/progressSlice';

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['/'], label: 'Open search / command palette' },
  { keys: ['↑', '↓'], label: 'Move through search results' },
  { keys: ['Enter'], label: 'Open the highlighted result' },
  { keys: ['Esc'], label: 'Close search or dialogs' },
  { keys: ['?'], label: 'Open this shortcuts panel' },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground shadow-sm">
      {children}
    </kbd>
  );
}

export function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const dispatch = useAppDispatch();
  const learning = useLearningProgress();
  const modules = useModuleProgress();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="shortcuts-dialog">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts &amp; progress</DialogTitle>
          <DialogDescription>Navigate the lab faster and track how far you’ve come.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <ProgressRing value={learning.pct} size={40} showLabel />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Learning</p>
              <p className="truncate text-xs text-muted-foreground">{learning.done}/{learning.total} lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <ProgressRing value={modules.pct} size={40} showLabel />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Practice</p>
              <p className="truncate text-xs text-muted-foreground">{modules.done}/{modules.total} modules</p>
            </div>
          </div>
        </div>

        <ul className="space-y-1.5">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3 rounded-lg px-1 py-1 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-xs text-muted-foreground">Reset clears your local progress.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(resetProgress())}
            data-testid="reset-progress"
          >
            Reset progress
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
