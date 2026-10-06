import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';

export function NotFoundPage() {
  return (
    <div className="full-page">
      <div className="card narrow center">
        <h1>Page not found</h1>
        <Link to={ROUTES.DASHBOARD}>Go to dashboard</Link>
      </div>
    </div>
  );
}
