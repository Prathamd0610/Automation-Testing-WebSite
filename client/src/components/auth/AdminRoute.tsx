import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

/**
 * Guards admin-only routes. Waits for session hydration, then requires both an
 * authenticated session and the `admin` role. Non-admins are redirected to the
 * dashboard; unauthenticated users to the login page.
 */
export function AdminRoute() {
  const { isAuthenticated, status, user, loadSession } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle') loadSession();
  }, [status, loadSession]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Checking access" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
