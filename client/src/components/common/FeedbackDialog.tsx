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

// Mirror the server validation rules so users get instant, specific feedback
// instead of a generic "Validation failed" from the API.
const SUBJECT_MIN = 3;
const SUBJECT_MAX = 160;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 2000;

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState<CreateFeedbackPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const subject = form.subject.trim();
  const message = form.message.trim();
  const subjectError =
    subject.length < SUBJECT_MIN
      ? `Subject must be at least ${SUBJECT_MIN} characters.`
      : subject.length > SUBJECT_MAX
        ? `Subject must be at most ${SUBJECT_MAX} characters.`
        : null;
  const messageError =
    message.length < MESSAGE_MIN
      ? `Details must be at least ${MESSAGE_MIN} characters.`
      : message.length > MESSAGE_MAX
        ? `Details must be at most ${MESSAGE_MAX} characters.`
        : null;
  const isValid = !subjectError && !messageError;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setSubmitting(true);
    try {
      // Send trimmed values so trailing whitespace can't trip server validation.
      await feedbackApi.submit({ ...form, subject, message, pageUrl: location.pathname });
      toast.success('Thanks! Your feedback was submitted.');
      setForm(EMPTY);
      setTouched(false);
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
                onBlur={() => setTouched(true)}
                required
                minLength={SUBJECT_MIN}
                maxLength={SUBJECT_MAX}
                placeholder={`Short summary (${SUBJECT_MIN}–${SUBJECT_MAX} characters)`}
                data-testid="feedback-subject"
                aria-invalid={touched && !!subjectError}
                aria-describedby={touched && subjectError ? 'feedback-subject-error' : undefined}
              />
              {touched && subjectError ? (
                <p
                  id="feedback-subject-error"
                  className="text-sm text-destructive"
                  data-testid="feedback-subject-error"
                >
                  {subjectError}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Details</Label>
              <Textarea
                id="feedback-message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                onBlur={() => setTouched(true)}
                required
                minLength={MESSAGE_MIN}
                maxLength={MESSAGE_MAX}
                rows={5}
                placeholder={`Describe the feature or issue, steps to reproduce, expected behavior… (${MESSAGE_MIN}–${MESSAGE_MAX} characters)`}
                data-testid="feedback-message"
                aria-invalid={touched && !!messageError}
                aria-describedby={touched && messageError ? 'feedback-message-error' : undefined}
              />
              {touched && messageError ? (
                <p
                  id="feedback-message-error"
                  className="text-sm text-destructive"
                  data-testid="feedback-message-error"
                >
                  {messageError}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || (touched && !isValid)}
                data-testid="feedback-submit"
              >
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
