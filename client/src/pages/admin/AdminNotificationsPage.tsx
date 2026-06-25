import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminApi } from '@/services/adminApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import type { BroadcastPayload } from '@/types/admin';

const EMPTY: BroadcastPayload = { title: '', message: '', type: 'info' };

export default function AdminNotificationsPage() {
  const [form, setForm] = useState<BroadcastPayload>(EMPTY);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      const { recipients } = await adminApi.broadcast(form);
      toast.success(`Broadcast sent to ${recipients} user${recipients === 1 ? '' : 's'}`);
      setForm(EMPTY);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Section
      title="Broadcast notification"
      description="Send a notification to every user. It appears in their notification feed in real time."
    >
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="broadcast-title">Title</Label>
              <Input
                id="broadcast-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                minLength={2}
                maxLength={120}
                data-testid="admin-broadcast-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-message">Message</Label>
              <Textarea
                id="broadcast-message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                required
                minLength={2}
                maxLength={500}
                rows={4}
                data-testid="admin-broadcast-message"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-type">Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((p) => ({ ...p, type: value as BroadcastPayload['type'] }))
                }
              >
                <SelectTrigger id="broadcast-type" className="w-48" data-testid="admin-broadcast-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={sending} data-testid="admin-broadcast-submit">
              {sending ? (
                <Spinner label="Sending" />
              ) : (
                <>
                  <Megaphone className="h-4 w-4" aria-hidden="true" />
                  Send broadcast
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Section>
  );
}
