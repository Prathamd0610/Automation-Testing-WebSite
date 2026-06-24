import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, isLoading, error, resetError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as LocationState | null)?.from ?? '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  useEffect(
    () => () => {
      resetError();
    },
    [resetError],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signIn({ email, password });
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (message) {
      toast.error(typeof message === 'string' ? message : 'Unable to sign in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FlaskConical className="h-6 w-6" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to access protected practice modules.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                data-testid="login-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                data-testid="login-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive" data-testid="login-error">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isLoading} data-testid="login-submit">
              {isLoading ? <Spinner label="Signing in" /> : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
