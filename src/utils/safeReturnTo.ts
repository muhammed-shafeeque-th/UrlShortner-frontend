import { ROUTES } from '../config/routes';

/** Only same-app absolute paths are allowed; blocks open redirects like //evil.com or https://evil.com. */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return ROUTES.DASHBOARD;
  if (value === ROUTES.LOGIN || value === ROUTES.REGISTER || value.startsWith('/login?') || value.startsWith('/register?')) return ROUTES.DASHBOARD;
  return value;
}
