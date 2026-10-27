import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const modules = [
  ['♙', 'User management', 'Browse accounts, roles and member details', 'Coming next'],
  ['▤', 'Notes overview', 'Review note totals and workspace activity', 'Coming next'],
  ['⚑', 'Reports & insights', 'Usage trends, growth and engagement', 'Planned'],
  ['⚙', 'Settings', 'Configure your admin workspace', 'Planned']
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const logout = useCallback(() => { localStorage.removeItem('admin-auth-token'); navigate('/admin/login', { replace: true }); }, [navigate]);

  const loadStats = useCallback(async () => {
    const token = localStorage.getItem('admin-auth-token');
    if (!token) { navigate('/admin/login', { replace: true }); return; }
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/admin/stats`, { method: 'GET', headers: { 'auth-token': token } });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) { localStorage.removeItem('admin-auth-token'); navigate('/admin/login', { replace: true }); return; }
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not load stats.');
      setStats(data);
    } catch (err) { setError(`${err.message || 'Backend connection failed.'} Check that your backend is running and the API URL is correct.`); }
    finally { setLoading(false); }
  }, [navigate]);
  useEffect(() => { loadStats(); }, [loadStats]);
  const users = stats?.totalUsers ?? stats?.totalAccounts ?? '—';

  return <div className="admin-layout">
    <aside className="admin-sidebar">
      <Link to="/admin/dashboard" className="admin-side-brand"><span className="admin-logo">iN</span><span><b>iNotebook</b><small>ADMIN CONSOLE</small></span></Link>
      <p className="admin-nav-heading">WORKSPACE</p>
      <nav><Link className="admin-nav-item selected" to="/admin/dashboard">◫ &nbsp; Overview <i>•</i></Link><span className="admin-nav-item inactive">♙ &nbsp; Users <em>SOON</em></span><span className="admin-nav-item inactive">▤ &nbsp; Notes <em>SOON</em></span><span className="admin-nav-item inactive">⚑ &nbsp; Reports <em>SOON</em></span></nav>
      <div className="admin-sidebar-bottom"><div className="admin-tip"><b>✦ Your workspace, your rules.</b><p>More management tools can be enabled as your project grows.</p></div><button className="admin-nav-item admin-logout" onClick={logout}>↪ &nbsp; Sign out</button><small className="admin-version">iNotebook · Admin v1.0</small></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div className="admin-crumb">Workspace <span>/</span> <b>Overview</b></div><div className="admin-user"><span className="admin-online">● SYSTEM ONLINE</span><span className="admin-avatar">A</span><span><b>Administrator</b><small>Admin account</small></span></div></header>
      <div className="admin-content">
        <section className="admin-welcome"><div><p className="admin-kicker">YOUR CONTROL CENTER</p><h1>Good to see you, Admin <span>✦</span></h1><p className="admin-subtitle">Here’s what’s happening across your iNotebook workspace.</p></div><button className="admin-refresh" onClick={loadStats} disabled={loading}>↻ &nbsp; Refresh data</button></section>
        {error && <div className="admin-error admin-dashboard-error"><b>Unable to load live stats</b><br />{error}<br /><button onClick={loadStats}>Try again</button></div>}
        <section className="admin-stats">
          <article className="admin-stat featured"><div className="admin-stat-label">Total registered users <span>♙</span></div><strong className="admin-number">{loading ? '…' : users}</strong><small>● &nbsp; Live count from MongoDB</small><div className="admin-watermark">USERS</div></article>
          <article className="admin-stat"><div className="admin-stat-label">Workspace status <span className="green-icon">✓</span></div><strong className="admin-status">● Connected</strong><small>Admin API responded successfully</small></article>
          <article className="admin-stat"><div className="admin-stat-label">Admin access <span className="purple-icon">♢</span></div><strong className="admin-status">Protected</strong><small>Token-protected endpoint</small></article>
        </section>
        <section className="admin-section-title"><div><p className="admin-kicker">GROW AS YOU BUILD</p><h2>Management tools</h2></div><span>4 MODULES PLANNED</span></section>
        <section className="admin-modules">{modules.map(([icon, title, description, status], i) => <article className="admin-module" key={title}><div className={`admin-module-icon module-${i}`}>{icon}</div><span className="admin-module-status">{status}</span><h3>{title}</h3><p>{description}</p><footer><span>Not active yet</span><span>↗</span></footer></article>)}</section>
        <section className="admin-note"><span className="admin-note-icon">✧</span><div><b>Built to grow with your app</b><p>User management, note moderation, analytics and settings are shown as future modules. They remain inactive until their backend APIs and permissions are implemented.</p></div><span className="admin-phase">PHASE 01</span></section>
        <footer className="admin-footer"><span>© {new Date().getFullYear()} iNotebook Admin Console</span><span>Designed for a calmer workflow ✦</span></footer>
      </div>
    </main>
  </div>;
}
