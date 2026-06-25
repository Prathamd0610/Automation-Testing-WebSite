import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { feedbackApi } from '@/services/feedbackApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import type { CreateFeedbackPayload, FeedbackPriority, FeedbackType } from '@/types/admin';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY: CreateFeedbackPayload = {
  type: 'feature',
  subject: '',
  message: '',
  priority: 'medium',
};

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState<CreateFeedbackPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await feedbackApi.submit({ ...form, pageUrl: location.pathname });
      toast.success('Thanks! Your feedback was submitted.');
      setForm(EMPTY);
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share feedback</DialogTitle>
          <DialogDescription>
            Report a bug, request a feature, or leave a comment. Your email is taken from your
            profile.
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="space-y-4 py-2" data-testid="feedback-login-gate">
            <p className="text-sm text-muted-foreground">
              Please sign in first so we can attach your feedback to your account and follow up.
            </p>
            <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
              <Link to="/login" data-testid="feedback-login-link">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign in to continue
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="feedback-email">Your email</Label>
              <Input
                id="feedback-email"
                value={user?.email ?? ''}
                readOnly
                disabled
                data-testid="feedback-email"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="feedback-type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm((p) => ({ ...p, type: value as FeedbackType }))}
                >
                  <SelectTrigger id="feedback-type" data-testid="feedback-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature request</SelectItem>
                    <SelectItem value="bug">Bug report</SelectItem>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-priority">Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, priority: value as FeedbackPriority }))
                  }
                >
                  <SelectTrigger id="feedback-priority" data-testid="feedback-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-subject">Subject</Label>
              <Input
                id="feedback-subject"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                required
                minLength={3}
                maxLength={160}
                placeholder="Short summary"
                data-testid="feedback-subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Details</Label>
              <Textarea
                id="feedback-message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                required
                minLength={5}
                maxLength={2000}
                rows={5}
                placeholder="Describe the feature or issue, steps to reproduce, expected behavior…"
                data-testid="feedback-message"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} data-testid="feedback-submit">
                {submitting ? (
                  <Spinner label="Sending" />
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Submit feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
