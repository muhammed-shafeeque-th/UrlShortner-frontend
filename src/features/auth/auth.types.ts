import type { ApiError } from '../../api/errors';

export interface User {
  id: string;
  email: string;
}
export interface Credentials {
  email: string;
  password: string;
}
/** `error` = the initial session check could not reach the server (distinct from "not logged in"). */
export type AuthStatus = 'unknown' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
export interface AuthState {
  status: AuthStatus;
  user: User | null;
  error: ApiError | null;
}
