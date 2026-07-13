/**
 * LoginPage.tsx — Firebase Authentication Sign-In Page
 *
 * Features:
 *  - Email + Password fields with live validation
 *  - Loading state during Firebase sign-in
 *  - Friendly error messages (no alert())
 *  - Post-login redirect to the originally requested page (or /)
 */

import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

// ── Firebase error code → human-readable message ─────────────────────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-credential':        'Incorrect email or password. Please try again.',
    'auth/user-not-found':            'No account found with this email.',
    'auth/wrong-password':            'Incorrect password. Please try again.',
    'auth/too-many-requests':         'Too many attempts. Please wait a moment and try again.',
    'auth/user-disabled':             'This account has been disabled. Contact support.',
    'auth/network-request-failed':    'Network error. Check your internet connection.',
    'auth/invalid-email':             'Please enter a valid email address.',
  };
  return map[code] ?? 'An unexpected error occurred. Please try again.';
}

// ── Validation ────────────────────────────────────────────────────────────────
interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Where to send the user after login (default → home)
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading,   setIsLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError('');

    const errors = validate(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setGlobalError(friendlyError(code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page" aria-label="Login page">
      <div className="auth-card">
        {/* ── Header ──────────────────────────────────── */}
        <p className="auth-card__badge">Authentication</p>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to your CodeAlpha account.</p>

        {/* ── Global Error ─────────────────────────────── */}
        {globalError && (
          <div className="auth-error-banner" role="alert" aria-live="assertive">
            <span aria-hidden="true">⚠️</span>
            {globalError}
          </div>
        )}

        {/* ── Form ─────────────────────────────────────── */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-email">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={`auth-field__input${fieldErrors.email ? ' auth-field__input--error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <span className="auth-field__error" role="alert">⚠ {fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={`auth-field__input${fieldErrors.password ? ' auth-field__input--error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <span className="auth-field__error" role="alert">⚠ {fieldErrors.password}</span>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading
              ? <><span className="auth-btn__spinner" aria-hidden="true" /> Signing in…</>
              : 'Sign In'
            }
          </button>
        </form>

        {/* ── Footer ────────────────────────────────────── */}
        <p className="auth-card__footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
