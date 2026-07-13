/**
 * RegisterPage.tsx — Firebase Authentication Registration Page
 *
 * Features:
 *  - Full Name, Email, Password, Confirm Password fields
 *  - Client-side validation with per-field error messages
 *  - Firebase account creation
 *  - MySQL sync via POST /api/auth/register
 *  - Loading state & friendly error messages
 *  - Navigates to Home on success
 */

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

// ── Firebase error code → human-readable message ─────────────────────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/weak-password':          'Password should be at least 6 characters.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/too-many-requests':      'Too many attempts. Please wait a moment and try again.',
  };
  return map[code] ?? 'An unexpected error occurred. Please try again.';
}

// ── Validation ────────────────────────────────────────────────────────────────
interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [fullName,        setFullName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors,     setFieldErrors]     = useState<FieldErrors>({});
  const [globalError,     setGlobalError]     = useState('');
  const [isLoading,       setIsLoading]       = useState(false);

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError('');

    const errors = validate(fullName, email, password, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await register(fullName.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      // Distinguish Firebase errors from backend/network errors
      if (code.startsWith('auth/')) {
        setGlobalError(friendlyError(code));
      } else {
        setGlobalError(
          (err as Error).message || 'Failed to create account. Please try again.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page" aria-label="Register page">
      <div className="auth-card">
        {/* ── Header ──────────────────────────────────── */}
        <p className="auth-card__badge">Authentication</p>
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">
          Join CodeAlpha and start shopping.
        </p>

        {/* ── Global Error ─────────────────────────────── */}
        {globalError && (
          <div className="auth-error-banner" role="alert" aria-live="assertive">
            <span aria-hidden="true">⚠️</span>
            {globalError}
          </div>
        )}

        {/* ── Form ─────────────────────────────────────── */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="reg-fullname">
              Full name
            </label>
            <input
              id="reg-fullname"
              type="text"
              autoComplete="name"
              className={`auth-field__input${fieldErrors.fullName ? ' auth-field__input--error' : ''}`}
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName'); }}
              disabled={isLoading}
            />
            {fieldErrors.fullName && (
              <span className="auth-field__error" role="alert">⚠ {fieldErrors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="reg-email">
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={`auth-field__input${fieldErrors.email ? ' auth-field__input--error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <span className="auth-field__error" role="alert">⚠ {fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              className={`auth-field__input${fieldErrors.password ? ' auth-field__input--error' : ''}`}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <span className="auth-field__error" role="alert">⚠ {fieldErrors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="reg-confirm">
              Confirm password
            </label>
            <input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              className={`auth-field__input${fieldErrors.confirmPassword ? ' auth-field__input--error' : ''}`}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
              disabled={isLoading}
            />
            {fieldErrors.confirmPassword && (
              <span className="auth-field__error" role="alert">⚠ {fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            id="register-submit"
            type="submit"
            className="auth-btn"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading
              ? <><span className="auth-btn__spinner" aria-hidden="true" /> Creating account…</>
              : 'Create Account'
            }
          </button>
        </form>

        {/* ── Footer ────────────────────────────────────── */}
        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
