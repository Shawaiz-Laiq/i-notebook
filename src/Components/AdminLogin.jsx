import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const API_BASE = process.env.REACT_APP_API_URL || 'https://firest-backend.vercel.app';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.jwtdata) throw new Error(data.error || 'Admin login failed.');
      localStorage.setItem('admin-auth-token', data.jwtdata);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) { setError(err.message || 'Unable to connect to backend.'); }
    finally { setLoading(false); }
  }

  return <main className="admin-login-page">
    <section className="admin-login-card">
      <div className="admin-brand"><span className="admin-logo">iN</span><span>iNotebook <small>CONTROL</small></span></div>
      <div className="admin-login-body">
        <div className="admin-lock">✦</div><p className="admin-kicker">SECURE ADMINISTRATOR ACCESS</p>
        <h1>Welcome back<span>.</span></h1><p className="admin-subtitle">Sign in to manage your iNotebook workspace.</p>
        {error && <div className="admin-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>
          <input id="admin-email" type="email" autoComplete="username" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <div className="admin-password-label"><label htmlFor="admin-password">Password</label><button type="button" className="admin-show" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your admin password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="admin-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Enter dashboard'} <span>↗</span></button>
        </form>
        <p className="admin-security">● Protected admin session · Role verified by server</p>
        <Link className="admin-back" to="/">← Back to iNotebook</Link>
      </div>
      <footer className="admin-login-footer">iNotebook Admin Console <span>Private workspace</span></footer>
    </section>
  </main>;
}
