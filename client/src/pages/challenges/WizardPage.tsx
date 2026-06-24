import { useMemo, useState } from 'react';
import { Wand2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRIES = ['United States', 'India', 'Canada', 'United Kingdom', 'Australia', 'Germany'] as const;
const STEPS = ['Account', 'Profile', 'Review'] as const;

interface WizardForm {
  email: string;
  password: string;
  fullName: string;
  country: string;
}

type TouchedField = keyof WizardForm;

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardForm>({ email: '', password: '', fullName: '', country: '' });
  const [touched, setTouched] = useState<Record<TouchedField, boolean>>({
    email: false,
    password: false,
    fullName: false,
    country: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: TouchedField) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const markTouched = (key: TouchedField) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  const errors = useMemo(() => {
    const emailError = !form.email
      ? 'Email is required'
      : EMAIL_RE.test(form.email)
        ? null
        : 'Enter a valid email address';
    const passwordError = !form.password
      ? 'Password is required'
      : form.password.length < 6
        ? 'Password must be at least 6 characters'
        : null;
    const fullNameError = form.fullName.trim() ? null : 'Full name is required';
    const countryError = form.country ? null : 'Select a country';
    return { emailError, passwordError, fullNameError, countryError };
  }, [form]);

  const stepValid = useMemo(() => {
    if (step === 0) return !errors.emailError && !errors.passwordError;
    if (step === 1) return !errors.fullNameError && !errors.countryError;
    return true;
  }, [step, errors]);

  const goNext = () => {
    if (step === 0) setTouched((prev) => ({ ...prev, email: true, password: true }));
    if (step === 1) setTouched((prev) => ({ ...prev, fullName: true, country: true }));
    if (stepValid) setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Wand2 className="h-5 w-5" />}
        title="Multi-step Wizard"
        description="A guarded three-step form with validation, step indicators and a final review."
      />

      <ol className="flex flex-wrap gap-2" data-testid="wizard-steps">
        {STEPS.map((label, index) => {
          const active = index === step;
          return (
            <li
              key={label}
              aria-current={active ? 'step' : undefined}
              data-testid={`wizard-step-${index}`}
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : index < step
                    ? 'border-success/40 bg-success/10 text-success'
                    : 'border-input text-muted-foreground',
              )}
            >
              <span className="font-semibold">{index + 1}</span>
              {label}
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit}>
        <Section title={STEPS[step]} id="wizard">
          <Card>
            <CardContent className="space-y-5 pt-6">
              {step === 0 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wizard-email">Email</Label>
                    <Input
                      id="wizard-email"
                      type="email"
                      data-testid="wizard-email"
                      value={form.email}
                      onChange={setField('email')}
                      onBlur={markTouched('email')}
                      aria-invalid={touched.email && Boolean(errors.emailError)}
                      aria-describedby={touched.email && errors.emailError ? 'wizard-email-error' : undefined}
                      placeholder="you@example.com"
                    />
                    {touched.email && errors.emailError ? (
                      <p id="wizard-email-error" role="alert" className="text-xs text-destructive" data-testid="wizard-email-error">
                        {errors.emailError}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-password">Password</Label>
                    <Input
                      id="wizard-password"
                      type="password"
                      data-testid="wizard-password"
                      value={form.password}
                      onChange={setField('password')}
                      onBlur={markTouched('password')}
                      aria-invalid={touched.password && Boolean(errors.passwordError)}
                      aria-describedby={touched.password && errors.passwordError ? 'wizard-password-error' : undefined}
                      placeholder="••••••••"
                    />
                    {touched.password && errors.passwordError ? (
                      <p id="wizard-password-error" role="alert" className="text-xs text-destructive" data-testid="wizard-password-error">
                        {errors.passwordError}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wizard-fullname">Full name</Label>
                    <Input
                      id="wizard-fullname"
                      data-testid="wizard-fullname"
                      value={form.fullName}
                      onChange={setField('fullName')}
                      onBlur={markTouched('fullName')}
                      aria-invalid={touched.fullName && Boolean(errors.fullNameError)}
                      aria-describedby={touched.fullName && errors.fullNameError ? 'wizard-fullname-error' : undefined}
                      placeholder="Ada Lovelace"
                    />
                    {touched.fullName && errors.fullNameError ? (
                      <p id="wizard-fullname-error" role="alert" className="text-xs text-destructive" data-testid="wizard-fullname-error">
                        {errors.fullNameError}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-country">Country</Label>
                    <Select
                      value={form.country}
                      onValueChange={(value) => {
                        setForm((prev) => ({ ...prev, country: value }));
                        setTouched((prev) => ({ ...prev, country: true }));
                      }}
                    >
                      <SelectTrigger id="wizard-country" data-testid="wizard-country">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.country && errors.countryError ? (
                      <p id="wizard-country-error" role="alert" className="text-xs text-destructive" data-testid="wizard-country-error">
                        {errors.countryError}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <dl className="grid gap-3 text-sm sm:grid-cols-2" data-testid="wizard-review">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
                    <dd className="font-medium text-foreground" data-testid="wizard-review-email">{form.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Full name</dt>
                    <dd className="font-medium text-foreground" data-testid="wizard-review-fullname">{form.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Country</dt>
                    <dd className="font-medium text-foreground" data-testid="wizard-review-country">{form.country}</dd>
                  </div>
                </dl>
              ) : null}
            </CardContent>
          </Card>
        </Section>

        <div className="mt-4 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 0} data-testid="wizard-back">
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext} disabled={!stepValid} data-testid="wizard-next">
              Next
            </Button>
          ) : (
            <Button type="submit" variant="success" data-testid="wizard-submit">
              Submit
            </Button>
          )}
        </div>
      </form>

      {submitted ? (
        <Card className="border-success/30 bg-success/10" data-testid="wizard-success">
          <CardContent className="space-y-1 pt-6 text-sm">
            <p className="font-semibold text-success">Registration complete</p>
            <p className="text-foreground">
              {form.fullName} ({form.email}) from {form.country} is all set.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </PageContainer>
  );
}
