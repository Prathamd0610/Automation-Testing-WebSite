import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/uiSlice';

/** Applies the active theme to the document root and exposes a toggle. */
export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
