import type { ApiError } from '../../api/errors';

export function ErrorMessage({ error, onRetry }: { error: ApiError | { message: string }; onRetry?: () => void }) {
  return (
    <div className="alert alert-error" role="alert">
      <span>{error.message}</span>
      {onRetry && (
        <button className="link-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
