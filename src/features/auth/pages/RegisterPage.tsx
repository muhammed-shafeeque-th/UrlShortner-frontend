import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiError, toApiError } from '../../../api/errors';
import { useAppDispatch } from '../../../app/hooks';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import { ROUTES } from '../../../config/routes';
import { useToast } from '../../../hooks/useToast';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { authApi } from '../api/auth.api';
import { login } from '../auth.slice';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null; confirm?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: confirm === password ? null : 'Passwords do not match.',
    };
    setErrors(next);
    if (next.email || next.password || next.confirm) return;

    setSubmitting(true);
    const creds = { email: email.trim(), password };
    try {
      await authApi.register(creds);
    } catch (err) {
      setFormError(toApiError(err).message);
      setSubmitting(false);
      return;
    }
    try {
      await dispatch(login(creds)).unwrap(); // PublicRoute then redirects to returnTo / dashboard
      toast.success('Welcome! Your account is ready.');
    } catch (err) {
      toast.info('Account created. Please log in.');
      setFormError((err as ApiError).message);
      setSubmitting(false);
    }
  }

  const loginLink = params.toString() ? `${ROUTES.LOGIN}?${params}` : ROUTES.LOGIN;

  return (
    <div className="full-page">
      <form className="card narrow" onSubmit={onSubmit} noValidate>
        <h1>Create account</h1>
        {formError && <ErrorMessage error={{ message: formError }} />}
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoFocus />
        <TextField label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <TextField label="Confirm password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
        <Button type="submit" loading={submitting}>
          Sign up
        </Button>
        <p className="muted center">
          Already have an account? <Link to={loginLink}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
