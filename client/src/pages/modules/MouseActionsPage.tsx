import { useEffect, useRef, useState } from 'react';
import { MousePointer2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuState {
  open: boolean;
  x: number;
  y: number;
}

const CONTEXT_ITEMS = ['Inspect element', 'Copy selector', 'Share link'] as const;

export default function MouseActionsPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [doubleClicks, setDoubleClicks] = useState(0);
  const [menu, setMenu] = useState<MenuState>({ open: false, x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [holding, setHolding] = useState(false);
  const [holdDuration, setHoldDuration] = useState<number | null>(null);
  const holdStart = useRef<number | null>(null);

  useEffect(() => {
    if (!menu.open) return;
    const close = () => setMenu((prev) => ({ ...prev, open: false }));
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menu.open]);

  const openContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ open: true, x: event.clientX - rect.left, y: event.clientY - rect.top });
    setLastAction('right-click');
  };

  const chooseItem = (label: string) => {
    setSelectedItem(label);
    setLastAction(`context:${label}`);
    setMenu((prev) => ({ ...prev, open: false }));
  };

  const startHold = () => {
    holdStart.current = performance.now();
    setHolding(true);
    setLastAction('hold-start');
  };

  const endHold = (reason: 'up' | 'leave') => {
    if (holdStart.current === null) return;
    const duration = Math.round(performance.now() - holdStart.current);
    holdStart.current = null;
    setHolding(false);
    setHoldDuration(duration);
    setLastAction(`hold-end:${reason}`);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<MousePointer2 className="h-5 w-5" />}
        title="Mouse Actions"
        description="Hover, double-click, right-click context menus and click-and-hold timing for advanced pointer automation."
      />

      <Section title="Hover" id="hover">
        <Card>
          <CardContent className="pt-6">
            <div
              data-testid="hover-target"
              className="flex h-28 cursor-pointer select-none items-center justify-center rounded-lg border border-dashed border-input bg-muted/40 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              onMouseEnter={() => {
                setHovering(true);
                setLastAction('hover-enter');
              }}
              onMouseLeave={() => {
                setHovering(false);
                setLastAction('hover-leave');
              }}
            >
              {hovering ? 'You are hovering the target' : 'Hover over me to reveal a message'}
            </div>
            {hovering ? (
              <p data-testid="hover-reveal" role="status" className="mt-3 text-sm font-medium text-success">
                Hidden content revealed on hover.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </Section>

      <Section title="Double click" id="double-click">
        <Card>
          <CardContent className="pt-6">
            <div
              data-testid="dbl-click-area"
              role="button"
              tabIndex={0}
              aria-label="Double click area"
              className={cn(
                'flex h-28 select-none flex-col items-center justify-center gap-1 rounded-lg border text-sm font-medium transition-colors',
                doubleClicks > 0
                  ? 'border-success/50 bg-success/10 text-foreground'
                  : 'border-input bg-background text-foreground hover:bg-accent',
              )}
              onDoubleClick={() => {
                setDoubleClicks((count) => count + 1);
                setLastAction('double-click');
              }}
            >
              {doubleClicks > 0 ? (
                <>
                  <span data-testid="dbl-click-message">Double-clicked {doubleClicks}×</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Double-click again to keep counting
                  </span>
                </>
              ) : (
                'Double-click anywhere in this box'
              )}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Right click menu" id="context-menu">
        <Card>
          <CardContent className="pt-6">
            <div
              data-testid="right-click-area"
              className="relative flex h-40 select-none items-center justify-center rounded-lg border border-input bg-muted/30 text-sm font-medium text-muted-foreground"
              onContextMenu={openContextMenu}
            >
              Right-click to open a custom context menu
              {menu.open ? (
                <ul
                  data-testid="context-menu"
                  role="menu"
                  className="absolute z-20 min-w-[180px] overflow-hidden rounded-lg border border-border bg-popover p-1 text-left shadow-card"
                  style={{ top: menu.y, left: menu.x }}
                >
                  {CONTEXT_ITEMS.map((item, index) => (
                    <li key={item} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        data-testid={`context-item-${index + 1}`}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        onClick={() => chooseItem(item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Click and hold" id="hold">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <Button
              data-testid="hold-button"
              variant={holding ? 'success' : 'default'}
              aria-pressed={holding}
              onMouseDown={startHold}
              onMouseUp={() => endHold('up')}
              onMouseLeave={() => endHold('leave')}
            >
              {holding ? 'Holding…' : 'Press and hold'}
            </Button>
            <span className="text-sm text-muted-foreground">Hold the button, then release to measure duration.</span>
          </CardContent>
        </Card>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel label="Last action" value={lastAction} testId="mouse-last-action" tone="success" />
        <ResultPanel label="Double clicks" value={doubleClicks} testId="dbl-click-count" />
        <ResultPanel label="Context selection" value={selectedItem} testId="context-selection" />
        <ResultPanel
          label="Hold duration (ms)"
          value={holdDuration}
          testId="hold-duration"
          tone={holdDuration !== null ? 'success' : 'default'}
        />
      </div>
    </PageContainer>
  );
}
