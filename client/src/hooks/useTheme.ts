import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, setUiMode } from '@/store/uiSlice';

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

/** Applies the active UI skin (classic / modern) to the document root. */
export function useUiMode() {
  const dispatch = useAppDispatch();
  const uiMode = useAppSelector((state) => state.ui.uiMode);

  useEffect(() => {
    document.documentElement.classList.toggle('ui-modern', uiMode === 'modern');
  }, [uiMode]);

  const toggleUiMode = () => dispatch(setUiMode(uiMode === 'modern' ? 'classic' : 'modern'));

  return { uiMode, toggleUiMode };
}
