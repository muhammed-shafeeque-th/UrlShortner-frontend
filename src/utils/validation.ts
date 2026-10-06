// Client-side validation is UX only; the backend is authoritative.
export const MAX_URL_LENGTH = 2048;

export const validateEmail = (v: string): string | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.length <= 320 ? null : 'Enter a valid email address.';

export const validatePassword = (v: string): string | null =>
  v.length < 8 ? 'Password must be at least 8 characters.' : v.length > 128 ? 'Password must be at most 128 characters.' : null;

export function validateHttpUrl(input: string): string | null {
  const v = input.trim();
  if (!v) return 'Enter a URL.';
  if (v.length > MAX_URL_LENGTH) return `URL must be at most ${MAX_URL_LENGTH} characters.`;
  try {
    const u = new URL(v);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return 'Only http:// and https:// URLs are allowed.';
    if (u.username || u.password) return 'URLs with embedded credentials are not allowed.';
    return null;
  } catch {
    return 'Enter a full URL, e.g. https://example.com/page';
  }
}
