export interface ShortUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
}
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
export interface ListUrlsArgs {
  page: number;
  limit: number;
}
