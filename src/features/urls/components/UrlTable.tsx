import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { CopyButton } from '../../../components/ui/CopyButton';
import { ROUTES } from '../../../config/routes';
import { displayHost, formatDate } from '../../../utils/format';
import type { ShortUrl } from '../urls.types';

interface Props {
  items: ShortUrl[];
  deletingId?: string;
  onDelete: (u: ShortUrl) => void;
}

export function UrlTable({ items, deletingId, onDelete }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Created</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>
                <a href={u.shortUrl} target="_blank" rel="noopener noreferrer">
                  {displayHost(u.shortUrl)}/{u.shortCode}
                </a>
              </td>
              <td className="truncate" title={u.originalUrl}>
                {u.originalUrl}
              </td>
              <td className="nowrap muted">{formatDate(u.createdAt)}</td>
              <td className="actions">
                <CopyButton text={u.shortUrl} />
                <Link className="btn btn-secondary" to={ROUTES.urlDetails(u.id)}>
                  Details
                </Link>
                <Button variant="danger" loading={deletingId === u.id} onClick={() => onDelete(u)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
