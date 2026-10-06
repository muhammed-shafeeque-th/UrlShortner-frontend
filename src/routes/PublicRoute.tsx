import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { FullPageSpinner } from '../components/feedback/Spinner';
import { selectAuthStatus } from '../features/auth/auth.selectors';
import { safeReturnTo } from '../utils/safeReturnTo';

export function PublicRoute() {
  const status = useAppSelector(selectAuthStatus);
  const [params] = useSearchParams();

  if (status === 'unknown' || status === 'loading') return <FullPageSpinner />;
  if (status === 'authenticated') return <Navigate to={safeReturnTo(params.get('returnTo'))} replace />;
  return <Outlet />;
}
