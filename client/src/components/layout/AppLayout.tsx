import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RailNav } from './RailNav';
import { ConsoleHeader } from './ConsoleHeader';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { AppLauncher } from './AppLauncher';
import { ModernLayout } from './ModernLayout';
import { useAppSelector } from '@/store/hooks';

/**
 * Classic shell — a "console" layout: a slim left icon rail with slide-out
 * flyout panels, a minimal command header, and breadcrumbs. Everything is also
 * reachable from the bento app launcher and the command palette.
 */
export function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const uiMode = useAppSelector((state) => state.ui.uiMode);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  if (uiMode === 'modern') {
    return <ModernLayout />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <RailNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <ConsoleHeader />
        <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 overflow-y-auto">
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Breadcrumbs />
              <div className="mt-4">
                <Outlet />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
      <AppLauncher />
    </div>
  );
}
