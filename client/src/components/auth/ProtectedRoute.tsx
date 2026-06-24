import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

/**
 * Guards routes that require an authenticated session. While the initial
 * `/auth/me` hydration is in flight we show a spinner instead of bouncing
 * the user to the login page prematurely.
 */
export function ProtectedRoute() {
  const { isAuthenticated, status, loadSession } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle') loadSession();
  }, [status, loadSession]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
