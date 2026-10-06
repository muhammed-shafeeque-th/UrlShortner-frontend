import { Link, useNavigate, useParams } from 'react-router-dom';
import { toApiError } from '../../../api/errors';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Spinner } from '../../../components/feedback/Spinner';
import { Button } from '../../../components/ui/Button';
import { CopyButton } from '../../../components/ui/CopyButton';
import { ROUTES } from '../../../config/routes';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../utils/format';
import { useDeleteUrlMutation, useGetUrlQuery } from '../api/urls.api';

export function UrlDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, error, isLoading, refetch } = useGetUrlQuery(id);
  const [deleteUrl, { isLoading: isDeleting }] = useDeleteUrlMutation();

  async function onDelete() {
    if (!data || !window.confirm(`Delete ${data.shortUrl}? Anyone using this link will get a 404.`)) return;
    try {
      await deleteUrl(data.id).unwrap();
      toast.success('Short URL deleted');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  }

  const apiError = error ? toApiError(error) : null;
  // The API answers 404 for both "doesn't exist" and "not yours" so ids can't be probed.
  const notFound = apiError?.status === 404 || apiError?.status === 400;

  return (
    <section className="card">
      <p>
        <Link to={ROUTES.DASHBOARD}>← Back to dashboard</Link>
      </p>
      {isLoading && <Spinner />}
      {notFound && (
        <div className="empty">
          <h2>URL not found</h2>
          <p className="muted">It may have been deleted, or it doesn’t belong to your account.</p>
        </div>
      )}
      {apiError && !notFound && <ErrorMessage error={apiError} onRetry={refetch} />}
      {data && (
        <>
          <h2>Short URL</h2>
          <a className="short-link" href={data.shortUrl} target="_blank" rel="noopener noreferrer">
            {data.shortUrl}
          </a>
          <dl className="details">
            <dt>Destination</dt>
            <dd className="break">{data.originalUrl}</dd>
            <dt>Short code</dt>
            <dd>{data.shortCode}</dd>
            <dt>Created</dt>
            <dd>{formatDate(data.createdAt)}</dd>
          </dl>
          <div className="row">
            <CopyButton text={data.shortUrl} />
            <a className="btn btn-secondary" href={data.shortUrl} target="_blank" rel="noopener noreferrer">
              Open
            </a>
            <Button variant="danger" loading={isDeleting} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
