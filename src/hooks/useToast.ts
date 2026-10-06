import { useMemo } from 'react';
import { useAppDispatch } from '../app/hooks';
import { pushToast } from '../app/ui.slice';

export function useToast() {
  const dispatch = useAppDispatch();
  return useMemo(
    () => ({
      success: (m: string) => dispatch(pushToast('success', m)),
      error: (m: string) => dispatch(pushToast('error', m)),
      info: (m: string) => dispatch(pushToast('info', m)),
    }),
    [dispatch],
  );
}
