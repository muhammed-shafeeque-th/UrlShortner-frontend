import { AxiosInstance, InternalAxiosRequestConfig, isAxiosError } from 'axios';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';
const SAFE_METHODS = new Set(['get', 'head', 'options']);
/** Never attempt a token refresh for these (prevents loops and pointless refreshes). */
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

type Retriable = InternalAxiosRequestConfig & { _retry?: boolean };

let onAuthFailure: (() => void) | null = null;
/** Registered by the store so this module never imports Redux (no circular deps). */
export const setAuthFailureHandler = (fn: (() => void) | null) => {
  onAuthFailure = fn;
};

export function readCookie(name: string): string | undefined {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function registerInterceptors(http: AxiosInstance): void {
  // Cookies carry the session, so the only thing to attach is the CSRF double-submit header.
  http.interceptors.request.use((config) => {
    if (!SAFE_METHODS.has((config.method ?? 'get').toLowerCase())) {
      const token = readCookie(CSRF_COOKIE);
      if (token) config.headers.set(CSRF_HEADER, token);
    }
    return config;
  });

  // Single-flight: every concurrent 401 awaits the same refresh request.
  let refreshing: Promise<void> | null = null;
  const refresh = () =>
    (refreshing ??= http
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshing = null;
      }));

  http.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error?.config as Retriable | undefined;
      const is401 = isAxiosError(error) && error.response?.status === 401;
      if (!is401 || !original || original._retry || NO_REFRESH.some((p) => original.url?.includes(p))) {
        return Promise.reject(error);
      }
      original._retry = true; // each request is retried at most once

      try {
        await refresh();
      } catch (refreshError) {
        const status = isAxiosError(refreshError) ? refreshError.response?.status : undefined;
        // Only a definitive rejection ends the session; a network blip must not log the user out.
        if (status === 401 || status === 403) onAuthFailure?.();
        return Promise.reject(error);
      }
      return http(original);
    },
  );
}
