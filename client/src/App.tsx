import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppRouter } from '@/routes/AppRouter';
import { store } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchMe } from '@/store/authSlice';
import { useTheme, useUiMode } from '@/hooks/useTheme';
import { queryClient } from '@/services/queryClient';

/** Hydrates the session once and keeps the theme class in sync with the store. */
function AppBootstrap() {
  const dispatch = useAppDispatch();
  useTheme();
  useUiMode();

  useEffect(() => {
    void dispatch(fetchMe());
  }, [dispatch]);

  return <AppRouter />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <AppBootstrap />
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}
