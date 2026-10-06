import { useEffect, useState } from 'react';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Spinner } from '../../../components/feedback/Spinner';
import { Button } from '../../../components/ui/Button';
import { toApiError } from '../../../api/errors';
import { useToast } from '../../../hooks/useToast';
import { useDeleteUrlMutation, useGetUrlsQuery } from '../api/urls.api';
import { CreateUrlForm } from '../components/CreateUrlForm';
import { UrlTable } from '../components/UrlTable';
import type { ShortUrl } from '../urls.types';

const PAGE_SIZE = 10;

export function DashboardPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching, refetch } = useGetUrlsQuery({ page, limit: PAGE_SIZE });
  const [deleteUrl, { originalArgs, isLoading: isDeleting }] = useDeleteUrlMutation();
  const toast = useToast();

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  // After deleting the last row of a later page, step back instead of showing an empty page.
  useEffect(() => {
    if (data && data.items.length === 0 && page > 1) setPage((p) => p - 1);
  }, [data, page]);

  async function onDelete(u: ShortUrl) {
    if (!window.confirm(`Delete ${u.shortUrl}? Anyone using this link will get a 404.`)) return;
    try {
      await deleteUrl(u.id).unwrap();
      toast.success('Short URL deleted');
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  }

  return (
    <>
      <CreateUrlForm onCreated={() => setPage(1)} />

      <section className="card">
        <div className="row between">
          <h2>My URLs</h2>
          {isFetching && !isLoading && <span className="muted">Updating…</span>}
        </div>

        {isLoading && <Spinner label="Loading your URLs…" />}
        {error && <ErrorMessage error={toApiError(error)} onRetry={refetch} />}
        {data && data.total === 0 && <p className="empty">You haven’t created any short URLs yet. Paste a link above to get started.</p>}
        {data && data.items.length > 0 && (
          <>
            <UrlTable items={data.items} deletingId={isDeleting ? originalArgs : undefined} onDelete={onDelete} />
            <div className="row between pager">
              <span className="muted">
                Page {page} of {totalPages} · {data.total} total
              </span>
              <div className="row">
                <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
