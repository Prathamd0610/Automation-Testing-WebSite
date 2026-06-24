import { useState } from 'react';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

export default function AuthDemoPage() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signIn({ email, password });
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to sign in');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Signed out');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to sign out');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Authentication"
        description="Sign in to reveal protected content, then sign out to reset the session."
      />

      <Section title="Session" id="session">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Current status</span>
          <Badge variant={isAuthenticated ? 'success' : 'secondary'} data-testid="auth-demo-status">
            {isAuthenticated ? 'authenticated' : 'anonymous'}
          </Badge>
        </div>
      </Section>

      {isAuthenticated && user ? (
        <Section title="Protected content" id="protected">
          <Card data-testid="auth-demo-protected">
            <CardHeader>
              <CardTitle>Welcome, {user.name}</CardTitle>
              <CardDescription>You are viewing content that requires authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt>
                  <dd className="text-sm font-medium text-foreground" data-testid="auth-demo-name">
                    {user.name}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
                  <dd className="text-sm font-medium text-foreground" data-testid="auth-demo-user-email">
                    {user.email}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</dt>
                  <dd data-testid="auth-demo-role">
                    <Badge variant="outline">{user.role}</Badge>
                  </dd>
                </div>
              </dl>
              <Button variant="outline" onClick={handleLogout} data-testid="auth-demo-logout">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </Section>
      ) : (
        <Section title="Sign in" id="sign-in">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Member login</CardTitle>
              <CardDescription>Sign in with your account to reveal protected content.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4" noValidate data-testid="auth-demo-form">
                <div className="space-y-2">
                  <Label htmlFor="auth-demo-email">Email</Label>
                  <Input
                    id="auth-demo-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    data-testid="auth-demo-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-demo-password">Password</Label>
                  <Input
                    id="auth-demo-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    data-testid="auth-demo-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} data-testid="auth-demo-login">
                  {isLoading ? (
                    <Spinner label="Signing in" />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Section>
      )}
    </PageContainer>
  );
}
