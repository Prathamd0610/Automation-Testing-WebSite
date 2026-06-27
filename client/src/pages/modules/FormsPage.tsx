import { useMemo, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirm: string;
  country: string;
  bio: string;
  terms: boolean;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  password: '',
  confirm: '',
  country: '',
  bio: '',
  terms: false,
};

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Germany', 'Australia'];
const BIO_MAX = 200;

function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/\d/.test(values.password)) errors.password = 'Password must contain a number.';
  if (values.confirm !== values.password) errors.confirm = 'Passwords do not match.';
  if (!values.country) errors.country = 'Please select a country.';
  if (values.bio.length > BIO_MAX) errors.bio = `Bio must be ${BIO_MAX} characters or fewer.`;
  if (!values.terms) errors.terms = 'You must accept the terms.';
  return errors;
}

export default function FormsPage() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const blur = (key: keyof FormState) => setTouched((prev) => ({ ...prev, [key]: true }));

  const showError = (key: keyof FormState) => touched[key] && errors[key];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true, country: true, bio: true, terms: true });
    if (!isValid) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setSubmitted(`${values.name} · ${values.email} · ${values.country}`);
    toast.success('Registration submitted successfully.');
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ClipboardCheck className="h-5 w-5" />}
        title="Form & Validation"
        description="A realistic registration form with live, field-level validation, a password rule, matching confirmation and a gated submit."
      />

      <Section title="Registration form" id="form" description="Errors appear after a field is touched; submit stays disabled until everything is valid.">
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate data-testid="signup-form">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="form-name">Full name</Label>
                  <Input
                    id="form-name"
                    data-testid="form-name"
                    value={values.name}
                    onChange={(e) => set('name', e.target.value)}
                    onBlur={() => blur('name')}
                    aria-invalid={Boolean(showError('name'))}
                  />
                  {showError('name') ? (
                    <p className="text-xs text-destructive" data-testid="error-name">{errors.name}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="form-email">Email</Label>
                  <Input
                    id="form-email"
                    type="email"
                    data-testid="form-email"
                    value={values.email}
                    onChange={(e) => set('email', e.target.value)}
                    onBlur={() => blur('email')}
                    aria-invalid={Boolean(showError('email'))}
                  />
                  {showError('email') ? (
                    <p className="text-xs text-destructive" data-testid="error-email">{errors.email}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="form-password">Password</Label>
                  <Input
                    id="form-password"
                    type="password"
                    data-testid="form-password"
                    value={values.password}
                    onChange={(e) => set('password', e.target.value)}
                    onBlur={() => blur('password')}
                    aria-invalid={Boolean(showError('password'))}
                  />
                  {showError('password') ? (
                    <p className="text-xs text-destructive" data-testid="error-password">{errors.password}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="form-confirm">Confirm password</Label>
                  <Input
                    id="form-confirm"
                    type="password"
                    data-testid="form-confirm"
                    value={values.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    onBlur={() => blur('confirm')}
                    aria-invalid={Boolean(showError('confirm'))}
                  />
                  {showError('confirm') ? (
                    <p className="text-xs text-destructive" data-testid="error-confirm">{errors.confirm}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="form-country">Country</Label>
                <select
                  id="form-country"
                  data-testid="form-country"
                  value={values.country}
                  onChange={(e) => set('country', e.target.value)}
                  onBlur={() => blur('country')}
                  className={cn(
                    'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <option value="">Select a country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {showError('country') ? (
                  <p className="text-xs text-destructive" data-testid="error-country">{errors.country}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="form-bio">Bio</Label>
                  <span
                    className={cn('text-xs', values.bio.length > BIO_MAX ? 'text-destructive' : 'text-muted-foreground')}
                    data-testid="bio-count"
                  >
                    {values.bio.length}/{BIO_MAX}
                  </span>
                </div>
                <Textarea
                  id="form-bio"
                  data-testid="form-bio"
                  rows={3}
                  value={values.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  onBlur={() => blur('bio')}
                />
                {showError('bio') ? (
                  <p className="text-xs text-destructive" data-testid="error-bio">{errors.bio}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="form-terms"
                  data-testid="form-terms"
                  checked={values.terms}
                  onCheckedChange={(checked) => {
                    set('terms', checked === true);
                    blur('terms');
                  }}
                />
                <Label htmlFor="form-terms">I accept the terms and conditions</Label>
              </div>
              {showError('terms') ? (
                <p className="-mt-3 text-xs text-destructive" data-testid="error-terms">{errors.terms}</p>
              ) : null}

              <div className="flex items-center gap-3">
                <Button type="submit" data-testid="form-submit" disabled={!isValid}>
                  Create account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-testid="form-reset"
                  onClick={() => {
                    setValues(EMPTY);
                    setTouched({});
                    setSubmitted(null);
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <ResultPanel
          label="Submitted account"
          value={submitted}
          testId="form-result"
          tone={submitted ? 'success' : 'default'}
        />
      </Section>
    </PageContainer>
  );
}
