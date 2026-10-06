import { Link, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { Button } from '../ui/Button';
import { ROUTES } from '../../config/routes';
import { selectCurrentUser } from '../../features/auth/auth.selectors';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { useState } from 'react';

export function AppLayout() {
  const user = useAppSelector(selectCurrentUser);
  const logout = useLogout();
  const [busy, setBusy] = useState(false);

  return (
    <>
      <header className="topbar">
        <Link to={ROUTES.DASHBOARD} className="brand">
          Shortly
        </Link>
        <div className="topbar-right">
          <span className="muted user-email">{user?.email}</span>
          <Button
            variant="secondary"
            loading={busy}
            onClick={async () => {
              setBusy(true);
              await logout();
              setBusy(false);
            }}
          >
            Log out
          </Button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
