import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SpotlightHeader } from './SpotlightHeader';
import { CommandDock } from './CommandDock';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { AppLauncher } from './AppLauncher';
import { AuroraBackground } from '@/components/common/AuroraBackground';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { MODULES } from '@/config/modules';
import { useAppDispatch } from '@/store/hooks';
import { addRecent } from '@/store/prefsSlice';

/**
 * Modern shell — an immersive, scroll-driven canvas with three floating glass
 * capsules up top (brand · spotlight search · actions) and a magnifying command
 * dock anchored to the bottom for primary navigation.
 */
export function ModernLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    const visited = MODULES.find((m) => m.path === location.pathname);
    if (visited) dispatch(addRecent(visited.id));
  }, [location.pathname, dispatch]);

  return (
    <div className="relative min-h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <AuroraBackground />
      <SpotlightHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative mx-auto w-full max-w-7xl px-4 pb-36 pt-24 sm:px-6 sm:pt-28 lg:px-8"
      >
        <div className="mb-4">
          <Breadcrumbs />
        </div>
        <Outlet />
      </main>
      <CommandDock />
      <Footer />
      <div className="h-24 sm:h-28" aria-hidden="true" />
      <AppLauncher />
    </div>
  );
}
