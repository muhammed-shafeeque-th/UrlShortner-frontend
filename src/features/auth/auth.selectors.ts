import type { RootState } from '../../app/store';

export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectCurrentUser = (s: RootState) => s.auth.user;
export const selectAuthError = (s: RootState) => s.auth.error;
export const selectIsAuthResolving = (s: RootState) => s.auth.status === 'unknown' || s.auth.status === 'loading';
