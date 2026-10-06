import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiError } from '../../../api/errors';
import { useAppDispatch } from '../../../app/hooks';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import { ROUTES } from '../../../config/routes';
import { validateEmail } from '../../../utils/validation';
import { login } from '../auth.slice';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const invalid = validateEmail(email);
    setEmailError(invalid);
    if (invalid || !password) {
      if (!password) setFormError('Enter your password.');
      return;
    }
    setSubmitting(true);
    try {
      // On success the status flips to "authenticated" and PublicRoute redirects to returnTo.
      await dispatch(login({ email: email.trim(), password })).unwrap();
    } catch (err) {
      setFormError((err as ApiError).message);
      setSubmitting(false);
    }
  }

  const registerLink = params.toString() ? `${ROUTES.REGISTER}?${params}` : ROUTES.REGISTER;

  return (
    <div className="full-page">
      <form className="card narrow" onSubmit={onSubmit} noValidate>
        <h1>Log in</h1>
        {formError && <ErrorMessage error={{ message: formError }} />}
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} autoFocus />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" loading={submitting}>
          Log in
        </Button>
        <p className="muted center">
          New here? <Link to={registerLink}>Create an account</Link>
        </p>
      </form>
    </div>
  );
}
