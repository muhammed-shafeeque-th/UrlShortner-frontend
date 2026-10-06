import { isAxiosError } from 'axios';

export interface ApiError {
  status: number; // 0 = no response (network/CORS/timeout)
  code?: string;
  message: string;
  details?: string[];
}

const isDomainCode = (v: unknown): v is string => typeof v === 'string' && /^[A-Z][A-Z0-9_]+$/.test(v);

export function toApiError(e: unknown): ApiError {
  if (isApiError(e)) return e;
  if (isAxiosError(e)) {
    if (!e.response) {
      return { status: 0, code: 'NETWORK_ERROR', message: 'Cannot reach the server. Check your connection and try again.' };
    }
    const { status, data, headers } = e.response;
    if (status === 429) {
      const retry = headers?.['retry-after'];
      return {
        status,
        code: 'RATE_LIMITED',
        message: retry ? `Too many requests. Try again in ${String(retry)}s.` : 'Too many requests. Please slow down and try again shortly.',
      };
    }
    const body = (data ?? {}) as { message?: string | string[]; error?: string };
    const details = Array.isArray(body.message) ? body.message : undefined;
    const fallback = status >= 500 ? 'Something went wrong on our side. Please try again.' : 'Request failed.';
    const message = details?.join('. ') || (typeof body.message === 'string' && body.message) || fallback;
    return { status, code: isDomainCode(body.error) ? body.error : undefined, message, details };
  }
  return { status: 0, code: 'UNKNOWN', message: e instanceof Error ? e.message : 'Unexpected error.' };
}

export function isApiError(e: unknown): e is ApiError {
  return typeof e === 'object' && e !== null && typeof (e as ApiError).status === 'number' && typeof (e as ApiError).message === 'string' && !isAxiosError(e);
}
