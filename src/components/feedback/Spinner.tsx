export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="center-block" role="status" aria-live="polite">
      <span className="spinner" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="full-page">
      <Spinner />
    </div>
  );
}
