import { useEffect, useState } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * App-wide toast portal. Theme follows the `dark` class on <html> so toasts
 * match the active color scheme without extra wiring.
 */
export function Toaster(props: ToasterProps) {
  const [theme, setTheme] = useState<ToasterProps['theme']>('light');

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ classNames: { toast: 'rounded-lg border shadow-apple-lg' } }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
