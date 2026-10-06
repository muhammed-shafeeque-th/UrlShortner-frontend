export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  URLS: '/urls',
  URL_DETAILS: '/urls/:id',
  urlDetails: (id: string) => `/urls/${id}`,
} as const;
