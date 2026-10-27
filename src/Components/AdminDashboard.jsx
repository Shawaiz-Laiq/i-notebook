
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import Footer from './footer';

const API_BASE =
  process.env.REACT_APP_API_URL || 'https://firest-backend.vercel.app';

const sections = {
  overview: 'Overview',
  users: 'Users',
  notes: 'Notes',
  reports: 'Reports',
  totalusers: 'Totalusers',
  totalnotes: 'Totalnotes'
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleString();
};

const StatCard = ({ label, value, detail, icon, featured = false }) => (
  <article className={`admin-stat ${featured ? 'featured' : ''}`}>
    <div className="admin-stat-label">
      {label} <span>{icon}</span>
    </div>
    <strong className="admin-number">{value}</strong>
    <small>{detail}</small>
    {featured && <div className="admin-watermark">USERS</div>}
  </article>
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logout = useCallback(() => {
    localStorage.removeItem('admin-auth-token');
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  const loadStats = useCallback(async () => {
    const token = localStorage.getItem('admin-auth-token');

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/admin/stats`,
        {
          method: 'GET',
          headers: {
            'auth-token': token
          }
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin-auth-token');
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not load dashboard data.');
      }

      setStats(data);
    } catch (err) {
      setError(
        `${err.message || 'Backend connection failed.'} Check your backend and API URL.`
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const users = stats?.totalUsers ?? stats?.totalAccounts ?? 0;
  const onlineUsers = stats?.onlineUsers ?? 0;
  const loginEvents = stats?.loginEvents24h ?? 0;
  const uniqueUsers = stats?.uniqueUsers24h ?? 0;

  const loginCounts = stats?.loginCountsByUser ?? [];
  const recentLogins = stats?.recentLogins ?? [];
  const noteCounts = stats?.noteCountsByUser ?? [];

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '620px'
  };

  const cellStyle = {
    padding: '13px 12px',
    textAlign: 'left',
    borderBottom: '1px solid #e8eaf0',
    fontSize: '13px'
  };

  const sectionStyle = {
    background: '#fff',
    border: '1px solid #e8eaf0',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '24px',
    overflowX: 'auto'
  };

  const renderTableMessage = (message, columns) => (
    <tr>
      <td style={cellStyle} colSpan={columns}>
        {message}
      </td>
    </tr>
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/admin/dashboard" className="admin-side-brand">
          <span className="admin-logo">iN</span>
          <span>
            <b>iNotebook</b>
            <small>ADMIN CONSOLE</small>
          </span>
        </Link>

        <p className="admin-nav-heading">WORKSPACE</p>

        <nav className="admin-navigation">
          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'overview' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('overview')}
          >
            ◫ &nbsp; Overview
            {activeSection === 'overview' && <i>•</i>}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'users' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('users')}
          >
            ♙ &nbsp; Users
            {activeSection === 'users' && <i>•</i>}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'notes' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('notes')}
          >
            ▤ &nbsp; Notes
            {activeSection === 'notes' && <i>•</i>}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'reports' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('reports')}
          >
            ⚑ &nbsp; Reports
            {activeSection === 'reports' && <i>•</i>}
          </button>

           <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'totalusers' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('totalusers')}
          >
           📊 &nbsp; Total User
            {activeSection === 'totalusers' && <i>•</i>}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'Totalnotes' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('Totalnotes')}
          >
           📊 &nbsp; Total Notes
            {activeSection === 'Totalnotes' && <i>•</i>}
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-tip">
            <b>✦ Your workspace, your rules.</b>
            <p>
              Monitor your users, notes and login activity in one place.
            </p>
          </div>

          <button
            type="button"
            className="admin-nav-item admin-logout"
            onClick={logout}
          >
            ↪ &nbsp; Sign out
          </button>

          <small className="admin-version">
            iNotebook · Admin v1.0
          </small>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-crumb">
            Workspace <span>/</span>
            <b>{sections[activeSection]}</b>
          </div>

          <div className="admin-user">
            <span className="admin-online">● SYSTEM ONLINE</span>
            <span className="admin-avatar">A</span>
            <span>
              <b>Administrator</b>
              <small>Admin account</small>
            </span>
          </div>
        </header>

        <div className="admin-content">
          {/* Error message */}
          {error && (
            <div className="admin-error admin-dashboard-error">
              <b>Unable to load live stats</b>
              <br />
              {error}
              <br />
              <button type="button" onClick={loadStats}>
                Try again
              </button>
            </div>
          )}

          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <>
              <section className="admin-welcome">
                <div>
                  <p className="admin-kicker">YOUR CONTROL CENTER</p>
                  <h1>
                    Good to see you, Admin <span>✦</span>
                  </h1>
                  <p className="admin-subtitle">
                    Here's what's happening across your iNotebook workspace.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-refresh"
                  onClick={loadStats}
                  disabled={loading}
                >
                  ↻ &nbsp; {loading ? 'Loading...' : 'Refresh data'}
                </button>
              </section>

              <section className="admin-stats">
                <StatCard
                  label="Registered users"
                  value={loading && !stats ? '…' : users}
                  detail="Live count from MongoDB"
                  icon="♙"
                  featured
                />

                <StatCard
                  label="Currently online"
                  value={loading && !stats ? '…' : onlineUsers}
                  detail="Active within the last 2 minutes"
                  icon="●"
                />

                <StatCard
                  label="Login events · 24h"
                  value={loading && !stats ? '…' : loginEvents}
                  detail="Successful login events"
                  icon="↗"
                />

                <StatCard
                  label="Unique users · 24h"
                  value={loading && !stats ? '…' : uniqueUsers}
                  detail="Different users who logged in"
                  icon="♧"
                />
              </section>

              <section className="admin-note">
                <span className="admin-note-icon">✧</span>
                <div>
                  <b>Workspace status</b>
                  <p>
                    {error
                      ? 'The dashboard could not retrieve the latest data.'
                      : loading
                        ? 'Connecting to your admin API...'
                        : 'Your protected admin API responded successfully.'}
                  </p>
                </div>
                <span className="admin-phase">
                  {error ? 'CHECK API' : 'LIVE DATA'}
                </span>
              </section>
            </>
          )}

          {/* USERS */}
          {activeSection === 'users' && (
            <>
              <section className="admin-welcome">
                <div>
                  <p className="admin-kicker">MEMBER ACTIVITY</p>
                  <h1>User management <span>♙</span></h1>
                  <p className="admin-subtitle">
                    See who logged in and how often users accessed iNotebook.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-refresh"
                  onClick={loadStats}
                  disabled={loading}
                >
                  ↻ &nbsp; {loading ? 'Loading...' : 'Refresh data'}
                </button>
              </section>

              <section className="admin-stats">
                <StatCard
                  label="Registered users"
                  value={loading && !stats ? '…' : users}
                  detail="All registered accounts"
                  icon="♙"
                />
                <StatCard
                  label="Online users"
                  value={loading && !stats ? '…' : onlineUsers}
                  detail="Active within the last 2 minutes"
                  icon="●"
                />
                <StatCard
                  label="Unique users · 24h"
                  value={loading && !stats ? '…' : uniqueUsers}
                  detail="Users who logged in"
                  icon="♧"
                />
              </section>

              <section style={sectionStyle}>
                <p className="admin-kicker">USER ANALYTICS</p>
                <h2>Login counts by user</h2>
                <p>Successful logins during the last 24 hours.</p>

                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={cellStyle}>User</th>
                      <th style={cellStyle}>Email</th>
                      <th style={cellStyle}>Login count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginCounts.length === 0
                      ? renderTableMessage(
                          loading ? 'Loading users...' : 'No login activity found.',
                          3
                        )
                      : loginCounts.map((user, index) => (
                          <tr key={user.email || index}>
                            <td style={cellStyle}>{user.name || 'Unknown'}</td>
                            <td style={cellStyle}>{user.email || '—'}</td>
                            <td style={cellStyle}>
                              <strong>{user.loginCount ?? 0}</strong>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* NOTES */}
          {activeSection === 'notes' && (
            <>
              <section className="admin-welcome">
                <div>
                  <p className="admin-kicker">WORKSPACE ACTIVITY</p>
                  <h1>Notes overview <span>▤</span></h1>
                  <p className="admin-subtitle">
                    Monitor the notes created, edited and deleted by users.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-refresh"
                  onClick={loadStats}
                  disabled={loading}
                >
                  ↻ &nbsp; {loading ? 'Loading...' : 'Refresh data'}
                </button>
              </section>

              <section style={sectionStyle}>
                <p className="admin-kicker">NOTES ANALYTICS</p>
                <h2>Notes activity by user</h2>
                <p>Recorded note activity during the last 24 hours.</p>

                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={cellStyle}>User</th>
                      <th style={cellStyle}>Email</th>
                      <th style={cellStyle}>Created</th>
                      <th style={cellStyle}>Edited</th>
                      <th style={cellStyle}>Deleted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noteCounts.length === 0
                      ? renderTableMessage(
                          loading
                            ? 'Loading note activity...'
                            : 'No tracked note activity found.',
                          5
                        )
                      : noteCounts.map((user, index) => (
                          <tr key={user.userId || user.email || index}>
                            <td style={cellStyle}>{user.name || 'Unknown'}</td>
                            <td style={cellStyle}>{user.email || '—'}</td>
                            <td style={cellStyle}>{user.notesCreated ?? 0}</td>
                            <td style={cellStyle}>{user.notesEdited ?? 0}</td>
                            <td style={cellStyle}>{user.notesDeleted ?? 0}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* REPORTS */}
          {activeSection === 'reports' && (
            <>
              <section className="admin-welcome">
                <div>
                  <p className="admin-kicker">LOGIN HISTORY</p>
                  <h1>Reports & insights <span>⚑</span></h1>
                  <p className="admin-subtitle">
                    Review recent successful logins recorded by your backend.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-refresh"
                  onClick={loadStats}
                  disabled={loading}
                >
                  ↻ &nbsp; {loading ? 'Loading...' : 'Refresh data'}
                </button>
              </section>

              <section className="admin-stats">
                <StatCard
                  label="Login events · 24h"
                  value={loading && !stats ? '…' : loginEvents}
                  detail="Successful login events"
                  icon="↗"
                />
                <StatCard
                  label="Unique users · 24h"
                  value={loading && !stats ? '…' : uniqueUsers}
                  detail="Different users who logged in"
                  icon="♧"
                />
              </section>

              <section style={sectionStyle}>
                <p className="admin-kicker">LATEST ACTIVITY</p>
                <h2>Recent logins</h2>
                <p>Latest recorded successful logins.</p>

                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={cellStyle}>User</th>
                      <th style={cellStyle}>Email</th>
                      <th style={cellStyle}>Role</th>
                      <th style={cellStyle}>Login time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogins.length === 0
                      ? renderTableMessage(
                          loading ? 'Loading login history...' : 'No recent logins found.',
                          4
                        )
                      : recentLogins.map((login, index) => (
                          <tr
                            key={`${login.email}-${login.loginAt}-${index}`}
                          >
                            <td style={cellStyle}>{login.name || 'Unknown'}</td>
                            <td style={cellStyle}>{login.email || '—'}</td>
                            <td style={cellStyle}>{login.role || 'user'}</td>
                            <td style={cellStyle}>{formatDate(login.loginAt)}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {activeSection === 'totalusers' && (
  <>
    <section className="admin-welcome">
      <div>
        <p className="admin-kicker">MEMBER ACTIVITY</p>
        <h1>Total User Management <span>♙</span></h1>
        <p className="admin-subtitle">
          View registered users, registration dates, and last login times.
        </p>
      </div>

      <button
        type="button"
        className="admin-refresh"
        onClick={loadStats}
        disabled={loading}
      >
        ↻ &nbsp; {loading ? 'Loading...' : 'Refresh data'}
      </button>
    </section>

    <section className="admin-stats">
      <StatCard
        label="Registered Users"
        value={loading && !stats ? '…' : (stats?.totalRegisteredUsers ?? 0)}
        detail="All registered user accounts"
        icon="♙"
      />

      <StatCard
        label="New Users"
        value={loading && !stats ? '…' : (stats?.newUsers24h ?? 0)}
        detail="Registered in the last 24 hours"
        icon="●"
      />

      <StatCard
        label="New Users This Month"
        value={loading && !stats ? '…' : (stats?.newUsersMonth ?? 0)}
        detail="Registered in the last 30 days"
        icon="♧"
      />
    </section>

    <section style={sectionStyle}>
      <p className="admin-kicker">USER ANALYTICS</p>
      <h2>All Registered Users</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>#</th>
            <th style={cellStyle}>User</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Created On</th>
            <th style={cellStyle}>Last Login</th>
          </tr>
        </thead>

        <tbody>
          {!stats && loading ? (
            renderTableMessage('Loading users...', 5)
          ) : (stats?.allUsers ?? []).length === 0 ? (
            renderTableMessage('No registered users found.', 5)
          ) : (
            stats.allUsers.map((user, index) => (
              <tr key={user._id || user.email || index}>
                <td style={cellStyle}>{index + 1}</td>

                <td style={cellStyle}>
                  {user.name || 'Unknown'}
                </td>

                <td style={cellStyle}>
                  {user.email || '—'}
                </td>

                <td style={cellStyle}>
                  {user.time
                    ? new Date(user.time).toLocaleString()
                    : '—'}
                </td>

                <td style={cellStyle}>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Same Day & Time'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  </>
)}


          {activeSection === 'Totalnotes' && (
  <>
    <section className="admin-welcome">
      <div>
        <p className="admin-kicker">NOTES ACTIVITY</p>
        <h1>Total Notes Management <span>📝</span></h1>
        <p className="admin-subtitle">
          Track total notes, recently created notes, and user activity.
        </p>
      </div>

      <button
        type="button"
        className="admin-refresh"
        onClick={loadStats}
        disabled={loading}
      >
        ↻ &nbsp; {loading ? 'Loading...' : 'Refresh data'}
      </button>
    </section>

    <section className="admin-stats">
      <StatCard
        label="Total Notes"
        value={loading && !stats ? '…' : (stats?.totalNotes ?? 0)}
        detail="All notes in the database"
        icon="📝"
      />

      <StatCard
        label="New Notes"
        value={loading && !stats ? '…' : (stats?.newNotes24h ?? 0)}
        detail="Created in the last 24 hours"
        icon="●"
      />

      <StatCard
        label="Notes This Month"
        value={loading && !stats ? '…' : (stats?.newNotesMonth ?? 0)}
        detail="Created in the last 30 days"
        icon="♧"
      />
    </section>

    <section style={sectionStyle}>
      <p className="admin-kicker">NOTES ANALYTICS</p>
      <h2>Notes by User</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>#</th>
            <th style={cellStyle}>User</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Total Notes</th>
            <th style={cellStyle}>Last Note Added</th>
          </tr>
        </thead>

        <tbody>
          {!stats && loading ? (
            renderTableMessage('Loading notes...', 5)
          ) : (stats?.notesByUser ?? []).length === 0 ? (
            renderTableMessage('No notes found.', 5)
          ) : (
            stats.notesByUser.map((user, index) => (
              <tr key={user.userId || user.email || index}>
                <td style={cellStyle}>{index + 1}</td>

                <td style={cellStyle}>
                  {user.name || 'Unknown'}
                </td>

                <td style={cellStyle}>
                  {user.email || '—'}
                </td>

                <td style={cellStyle}>
                  <strong>{user.totalNotes ?? 0}</strong>
                </td>

                <td style={cellStyle}>
                  {user.lastNoteAdded
                    ? new Date(user.lastNoteAdded).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  </>
)}
          

         <Footer/>
        </div>
      </main>
    </div>
  );
}
