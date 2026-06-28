import { useMemo, useState } from 'react';
import { Inbox, Check, CheckCheck, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Note {
  id: number;
  title: string;
  body: string;
  read: boolean;
}

const SEED: Note[] = [
  { id: 1, title: 'Build passed', body: 'CI pipeline #482 finished successfully.', read: false },
  { id: 2, title: 'New comment', body: 'Alice mentioned you on PR #91.', read: false },
  { id: 3, title: 'Deploy complete', body: 'Release v2.4.0 is live in production.', read: false },
  { id: 4, title: 'Weekly report', body: 'Your test coverage rose to 87%.', read: true },
];

/**
 * Notifications center — unread badges, mark one/all as read, and dismiss.
 * The unread counter is the kind of derived state automation loves to assert.
 */
export default function NotificationsPage() {
  const [notes, setNotes] = useState<Note[]>(SEED);
  const unread = useMemo(() => notes.filter((n) => !n.read).length, [notes]);

  const markRead = (id: number) => setNotes((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAll = () => setNotes((p) => p.map((n) => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotes((p) => p.filter((n) => n.id !== id));

  return (
    <PageContainer>
      <PageHeader
        icon={<Inbox className="h-5 w-5" />}
        title="Notifications Center"
        description="Mark notifications as read individually or all at once, and dismiss them. The unread badge updates as state changes."
        actions={
          <Badge variant="secondary" className="rounded-full" data-testid="notif-unread-badge">
            {unread} unread
          </Badge>
        }
      />

      <Section
        title="Inbox"
        id="inbox"
        description="Each card exposes its read state via data-read for precise assertions."
      >
        <div className="mb-3 flex gap-2">
          <Button size="sm" variant="outline" data-testid="notif-mark-all" disabled={unread === 0} onClick={markAll}>
            <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all read
          </Button>
        </div>

        {notes.length === 0 ? (
          <p className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground" data-testid="notif-empty">
            You’re all caught up.
          </p>
        ) : (
          <ul className="space-y-2" data-testid="notif-list">
            {notes.map((n) => (
              <li key={n.id}>
                <Card data-testid={`notif-${n.id}`} data-read={n.read} className={cn(!n.read && 'border-primary/40 bg-primary/5')}>
                  <CardContent className="flex items-start justify-between gap-3 py-3">
                    <div className="flex items-start gap-3">
                      {!n.read ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" data-testid={`notif-dot-${n.id}`} aria-label="unread" /> : <span className="mt-1.5 h-2 w-2 shrink-0" />}
                      <div>
                        <p className="font-medium text-foreground">{n.title}</p>
                        <p className="text-sm text-muted-foreground">{n.body}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {!n.read ? (
                        <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Mark read" data-testid={`notif-read-${n.id}`} onClick={() => markRead(n.id)}>
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      ) : null}
                      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Dismiss" data-testid={`notif-dismiss-${n.id}`} onClick={() => dismiss(n.id)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Unread" value={unread} testId="notif-unread" tone={unread ? 'warning' : 'success'} />
          <ResultPanel label="Total" value={notes.length} testId="notif-total" />
        </div>
      </Section>
    </PageContainer>
  );
}
