import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ROUTES } from '../config/routes';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { NotFoundPage } from '../features/auth/pages/NotFoundPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/urls/pages/DashboardPage';
import { UrlDetailsPage } from '../features/urls/pages/UrlDetailsPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { PublicRoute } from '../routes/PublicRoute';

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
  {
    element: <PublicRoute />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.URLS, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          { path: ROUTES.URL_DETAILS, element: <UrlDetailsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
