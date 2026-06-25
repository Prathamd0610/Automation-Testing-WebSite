import { useEffect, useState } from 'react';
import { Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminApi } from '@/services/adminApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import type { AuditLog } from '@/types/admin';

function formatTime(value: string): string {
  return new Date(value).toLocaleString();
}

function summarize(metadata?: Record<string, unknown>): string {
  if (!metadata) return '—';
  return Object.entries(metadata)
    .map(([key, val]) => `${key}: ${String(val)}`)
    .join(', ');
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.listAuditLogs({ limit: 100 });
        if (!cancelled) setLogs(res.data);
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
  }, []);

  return (
    <Section
      title="Audit log"
      description="A record of sensitive admin actions (role changes, balance adjustments, deletions)."
    >
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8" data-testid="admin-audit-loading">
              <Spinner label="Loading audit log" />
            </div>
          ) : logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No audit entries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} data-testid={`admin-audit-row-${log.id}`}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(log.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">{log.actor ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.entity}</TableCell>
                      <TableCell className="max-w-md truncate text-xs text-muted-foreground">
                        {summarize(log.metadata)}
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
