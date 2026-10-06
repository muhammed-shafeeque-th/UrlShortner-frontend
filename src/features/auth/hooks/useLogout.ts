import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSlice } from '../../../api/apiSlice';
import { useAppDispatch } from '../../../app/hooks';
import { ROUTES } from '../../../config/routes';
import { useToast } from '../../../hooks/useToast';
import { logout } from '../auth.slice';

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  return useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(apiSlice.util.resetApiState()); // never leak one user's cached data to the next
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      toast.error('Could not sign out. Please try again.');
    }
  }, [dispatch, navigate, toast]);
}
