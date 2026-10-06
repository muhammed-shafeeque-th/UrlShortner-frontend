import { FormEvent, useEffect, useState } from 'react';
import { ApiError, toApiError } from '../../../api/errors';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import { useToast } from '../../../hooks/useToast';
import { validateHttpUrl } from '../../../utils/validation';
import { useCreateUrlMutation } from '../api/urls.api';
import type { ShortUrl } from '../urls.types';
import { CopyButton } from '../../../components/ui/CopyButton';

export function CreateUrlForm({ onCreated }: { onCreated?: () => void }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<ShortUrl | null>(null);
  const [createUrl, { isLoading }] = useCreateUrlMutation();
  const toast = useToast();

  useEffect(() => {
    let timer = setTimeout(() => setCreated(null), 5000);

    () => clearTimeout(timer);
  }, [created])

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const invalid = validateHttpUrl(url);
    setError(invalid);
    if (invalid) return;
    try {
      const result = await createUrl(url.trim()).unwrap();
      setCreated(result);
      setUrl('');
      onCreated?.();
    } catch (err) {
      const apiError = toApiError(err) as ApiError;
      setError(apiError.message);
      if (apiError.status === 429) toast.error(apiError.message);
    }
  }

  return (
    <section className="card">
      <h2>Create a short URL</h2>
      <form onSubmit={onSubmit} noValidate className="inline-form">
        <TextField
          label="Destination URL"
          type="url"
          inputMode="url"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={error}
          autoComplete="off"
        />
        <Button type="submit" loading={isLoading}>
          Shorten URL
        </Button>
      </form>

      {created && (
        <div className="result" role="status">
          <p className="muted">Short URL created</p>
          <a className="short-link" href={created.shortUrl} target="_blank" rel="noopener noreferrer">
            {created.shortUrl}
          </a>
          <div className="row">
            <CopyButton text={created.shortUrl} />
            <a className="btn btn-secondary" href={created.shortUrl} target="_blank" rel="noopener noreferrer">
              Open
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
