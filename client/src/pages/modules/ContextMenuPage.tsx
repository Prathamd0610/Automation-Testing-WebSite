import { useEffect, useState } from 'react';
import { Menu, Copy, Pencil, Trash2, Share2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';

const ITEMS = [
  { id: 'copy', label: 'Copy', icon: Copy },
  { id: 'edit', label: 'Edit', icon: Pencil },
  { id: 'share', label: 'Share', icon: Share2 },
  { id: 'delete', label: 'Delete', icon: Trash2 },
];

/**
 * Right-click context menu — a custom menu that opens at the pointer, closes
 * on outside click or Escape, and reports the chosen action. Tests must use a
 * context-click (right button) to open it.
 */
export default function ContextMenuPage() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null);
    window.addEventListener('click', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  return (
    <PageContainer>
      <PageHeader
        icon={<Menu className="h-5 w-5" />}
        title="Context Menu"
        description="Right-click the target area to open a custom menu. Pick an action, or dismiss it with Escape or an outside click."
      />

      <Section title="Right-click target" id="target">
        <Card>
          <CardContent className="pt-6">
            <div
              data-testid="context-target"
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ x: e.clientX, y: e.clientY });
              }}
              className="flex h-56 select-none items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground"
            >
              Right-click anywhere in this box
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <ResultPanel label="Last action" value={action} testId="context-result" tone={action ? 'success' : 'default'} />
      </Section>

      {menu ? (
        <ul
          role="menu"
          data-testid="context-menu"
          style={{ top: menu.y, left: menu.x }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-44 overflow-hidden rounded-lg border bg-popover p-1 shadow-apple-lg"
        >
          {ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                role="menuitem"
                data-testid={`context-item-${id}`}
                onClick={() => {
                  setAction(label);
                  setMenu(null);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground hover:bg-accent"
              >
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </PageContainer>
  );
}
