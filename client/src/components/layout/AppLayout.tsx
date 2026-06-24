import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';

export function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Global "/" shortcut focuses search; handled here so it works on every page.
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

  // Reset the content scroll position to the top on every route change so pages
  // always open from the start instead of inheriting the previous scroll offset.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <Breadcrumbs />
              <div className="mt-4">
                <Outlet />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
