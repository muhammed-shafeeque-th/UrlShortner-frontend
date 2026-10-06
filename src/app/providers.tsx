import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';
import { ToastHost } from '../components/feedback/ToastHost';
import { AuthInitializer } from '../routes/AuthInitializer';
import { store } from './store';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <AuthInitializer>{children}</AuthInitializer>
        <ToastHost />
      </ ReduxProvider>
    </ErrorBoundary>
  );
}
