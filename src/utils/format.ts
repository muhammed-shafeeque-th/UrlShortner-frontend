export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function displayHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
