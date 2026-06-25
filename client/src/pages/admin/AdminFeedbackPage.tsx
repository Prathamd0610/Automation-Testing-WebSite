import { useCallback, useEffect, useState } from 'react';
import { Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { feedbackApi } from '@/services/feedbackApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import type { Feedback, FeedbackPriority, FeedbackStatus, FeedbackType } from '@/types/admin';

const TYPE_LABEL: Record<FeedbackType, string> = {
  feature: 'Feature',
  bug: 'Bug',
  comment: 'Comment',
  other: 'Other',
};

const PRIORITY_VARIANT: Record<FeedbackPriority, BadgeProps['variant']> = {
  low: 'secondary',
  medium: 'warning',
  high: 'destructive',
};

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In review' },
  { value: 'resolved', label: 'Resolved' },
];

function formatTime(value: string): string {
  return new Date(value).toLocaleString();
}

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await feedbackApi.list({ limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) toast.error(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const handleStatus = async (item: Feedback, status: FeedbackStatus) => {
    setBusyId(item.id);
    try {
      await feedbackApi.updateStatus(item.id, status);
      toast.success('Status updated');
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Section
      title="Feedback & feature requests"
      description="Submissions from users — triage by updating each item's status."
    >
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8" data-testid="admin-feedback-loading">
              <Spinner label="Loading feedback" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No feedback yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Subject / details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} data-testid={`admin-feedback-row-${item.id}`}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(item.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{TYPE_LABEL[item.type]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={PRIORITY_VARIANT[item.priority]}>{item.priority}</Badge>
                      </TableCell>
                      <TableCell className="max-w-sm">
                        <div className="font-medium text-foreground">{item.subject}</div>
                        <div className="text-xs text-muted-foreground">{item.message}</div>
                        {item.pageUrl ? (
                          <div className="mt-1 text-[11px] text-muted-foreground/80">
                            on <code>{item.pageUrl}</code>
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          disabled={busyId === item.id}
                          onValueChange={(value) => handleStatus(item, value as FeedbackStatus)}
                        >
                          <SelectTrigger
                            className="w-32"
                            data-testid={`admin-feedback-status-${item.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
