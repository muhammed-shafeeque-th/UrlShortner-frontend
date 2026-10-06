import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { FullPageSpinner } from '../components/feedback/Spinner';
import { selectAuthError, selectAuthStatus } from '../features/auth/auth.selectors';
import { initializeSession } from '../features/auth/auth.slice';

export function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    dispatch(initializeSession());
  }, [dispatch]);

  if (status === 'unknown' || status === 'loading') return <FullPageSpinner />;
  if (status === 'error') {
    return (
      <div className="full-page">
        <div className="card narrow">
          <h1>Can’t reach the server</h1>
          <ErrorMessage error={error ?? { message: 'Unknown error' }} onRetry={() => dispatch(initializeSession())} />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
