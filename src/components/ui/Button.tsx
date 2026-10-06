import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ loading, variant = 'primary', disabled, children, className = '', ...rest }: Props) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={loading || disabled} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="spinner spinner-sm" aria-hidden />}
      {children}
    </button>
  );
}
