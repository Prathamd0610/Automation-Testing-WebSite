import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

const PASSWORD_HINT = 'At least 8 characters, including upper, lower and a number.';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, isLoading, error, resetError } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(
    () => () => {
      resetError();
    },
    [resetError],
  );

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signUp(form);
      toast.success('Account created');
      navigate('/', { replace: true });
    } catch (message) {
      toast.error(typeof message === 'string' ? message : 'Unable to register');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FlaskConical className="h-6 w-6" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Register to unlock authenticated practice scenarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate data-testid="register-form">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={update('name')}
                data-testid="register-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update('email')}
                data-testid="register-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={update('password')}
                aria-describedby="password-hint"
                data-testid="register-password"
              />
              <p id="password-hint" className="text-xs text-muted-foreground">
                {PASSWORD_HINT}
              </p>
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive" data-testid="register-error">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isLoading} data-testid="register-submit">
              {isLoading ? <Spinner label="Creating account" /> : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
