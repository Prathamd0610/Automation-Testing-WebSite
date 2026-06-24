import { useMemo, useState } from 'react';
import { AlignLeft, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BIO = 140;

export default function InputsPage() {
  const [values, setValues] = useState({
    text: '',
    email: '',
    password: '',
    number: '',
    search: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const emailError = useMemo(() => {
    if (!values.email) return null;
    return EMAIL_RE.test(values.email) ? null : 'Enter a valid email address';
  }, [values.email]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(JSON.stringify({ ...values, bio }));
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<AlignLeft className="h-5 w-5" />}
        title="Input Fields"
        description="Text, email, password, number and multiline inputs with live state and validation."
      />

      <Section title="Standard inputs" id="standard">
        <Card>
          <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="in-text">Text</Label>
              <Input id="in-text" data-testid="input-text" value={values.text} onChange={set('text')} placeholder="Type something" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="in-email">Email</Label>
              <Input
                id="in-email"
                type="email"
                data-testid="input-email"
                value={values.email}
                onChange={set('email')}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                placeholder="you@example.com"
              />
              {emailError ? (
                <p id="email-error" role="alert" className="text-xs text-destructive" data-testid="input-email-error">
                  {emailError}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="in-password">Password</Label>
              <div className="relative">
                <Input
                  id="in-password"
                  type={showPassword ? 'text' : 'password'}
                  data-testid="input-password"
                  value={values.password}
                  onChange={set('password')}
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="in-number">Number</Label>
              <Input id="in-number" type="number" data-testid="input-number" value={values.number} onChange={set('number')} placeholder="42" />
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Multiline & counter" id="multiline">
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Label htmlFor="in-bio">Short bio</Label>
            <Textarea
              id="in-bio"
              data-testid="input-bio"
              value={bio}
              maxLength={MAX_BIO}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell us about your automation experience"
            />
            <p className="text-right text-xs text-muted-foreground" data-testid="bio-counter">
              {bio.length}/{MAX_BIO}
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section title="States" id="states">
        <Card>
          <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="in-readonly">Read-only</Label>
              <Input id="in-readonly" readOnly value="Read-only value" data-testid="input-readonly" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="in-disabled">Disabled</Label>
              <Input id="in-disabled" disabled value="Disabled value" data-testid="input-disabled" />
            </div>
          </CardContent>
        </Card>
      </Section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button type="submit" data-testid="input-submit">
            Submit values
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setValues({ text: '', email: '', password: '', number: '', search: '' });
              setBio('');
              setSubmitted(null);
            }}
            data-testid="input-reset"
          >
            Reset
          </Button>
        </div>
        <ResultPanel label="Submitted payload" value={submitted} testId="input-result" tone="success" />
      </form>
    </PageContainer>
  );
}
