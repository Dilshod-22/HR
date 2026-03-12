import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import './LoginPage.css';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login.trim() || !password) {
      setError('Login va parolni kiriting');
      return;
    }
    setSubmitting(true);
    try {
      await doLogin(login.trim(), password);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login yoki parol noto‘g‘ri');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Tizimga kirish</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label">
            Login
            <input
              className="form-input"
              type="text"
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            Parol
            <input
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-primary login-submit" disabled={submitting}>
            {submitting ? 'Kirilmoqda…' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
}
