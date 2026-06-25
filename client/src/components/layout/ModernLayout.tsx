import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ModernNav } from './ModernNav';
import { Footer } from './Footer';
import { AuroraBackground } from '@/components/common/AuroraBackground';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { MODULES } from '@/config/modules';
import { useAppDispatch } from '@/store/hooks';
import { addRecent } from '@/store/prefsSlice';

/**
 * Modern-skin application shell. A full-width immersive canvas that scrolls on
 * the window (enabling smooth, scroll-driven storytelling) with a floating top
 * navigation and an aurora backdrop — distinct from the classic sidebar layout.
 */
export function ModernLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Global "/" shortcut focuses search on every page.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName) &&
        !(event.target as HTMLElement)?.isContentEditable
      ) {
        event.preventDefault();
        document.querySelector<HTMLButtonElement>('[data-testid="open-search"]')?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Reset scroll on navigation and record the recently-viewed module.
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
      <ModernNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:px-8"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
