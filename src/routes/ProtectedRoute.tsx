import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { FullPageSpinner } from '../components/feedback/Spinner';
import { ROUTES } from '../config/routes';
import { selectAuthStatus } from '../features/auth/auth.selectors';

export function ProtectedRoute() {
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'unknown' || status === 'loading') return <FullPageSpinner />;
  if (status !== 'authenticated') {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.LOGIN}?returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
