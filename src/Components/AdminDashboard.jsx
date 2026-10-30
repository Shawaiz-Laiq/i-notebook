
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import Footer from './footer';
import EmailHistory from './EmailHistory';
import SendNotesHistory from "./SendNotesHistory";

const API_BASE =
  process.env.REACT_APP_API_URL || 'https://firest-backend.vercel.app';

const sections = {
  overview: 'Overview',
  users: 'Users',
  notes: 'Notes',
  reports: 'Reports',
  totalusers: 'Total Users',
  totalnotes: 'Total Notes',
  deletedusers: 'Deleted Users',
  emaildata: 'Email Data',
  sendnote: "Send Notes",
};


const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleString();
};

const StatCard = ({ label, value, detail, icon, featured = false }) => {
  const safeValue =
    typeof value === 'string' || typeof value === 'number'
      ? value
      : '—';

  return (
    <article className={`admin-stat ${featured ? 'featured' : ''}`}>
      <div className="admin-stat-label">
        {label} <span>{icon}</span>
      </div>

      <strong className="admin-number">{safeValue}</strong>

      <small>{detail}</small>

      {featured && <div className="admin-watermark">USERS</div>}
    </article>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notesSlide, setNotesSlide] = useState(0);
  const [notesHistory, setNotesHistory] = useState(null);
 // const [historyLoading, setHistoryLoading] = useState(false);
  //const [historyError, setHistoryError] = useState('');

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

  
const loadNotesHistory = useCallback(async () => {
  const token = localStorage.getItem('admin-auth-token');

  if (!token) {
    navigate('/admin/login', { replace: true });
    return;
  }

 // setHistoryLoading(true);
 // setHistoryError('');

  try {
    const response = await fetch(
      `${API_BASE}/api/auth/admin/notes-history`,
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
      throw new Error(
        data.error || data.message || 'Could not load notes history.'
      );
    }

    setNotesHistory(data);
  } catch (err) {
    // setHistoryError(
    //   err.message || 'Failed to fetch notes history.'
    // );
  } finally {
   // setHistoryLoading(false);
  }
}, [navigate]);

useEffect(() => {
  loadNotesHistory();
}, [loadNotesHistory]);


  const deleteUser = async (user) => {
  if (!user?._id) {
    setError('User ID not found.');
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to move ${user.name || user.email} to Deleted Users?`
  );

  

  if (!confirmed) return;

  const token = localStorage.getItem('admin-auth-token');

  try {
    setError('');

    const response = await fetch(
      `${API_BASE}/api/auth/admin/delete-user/${user._id}`,
      {
        method: 'DELETE',
        headers: {
          'auth-token': token
        }
      }
    );

    const data = await response.json();
    console.log("ADMIN STATS RESPONSE:", data);
console.log("DELETED USERS:", data.deletedUsers);

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Could not delete user.');
    }

    await loadStats();

    window.alert(data.message || 'User moved to Deleted Users successfully.');
  } catch (err) {
    setError(err.message || 'Failed to delete user.');
  }
};

  useEffect(() => {
    loadStats();
  }, [loadStats]);

const users =
  typeof stats?.totalRegisteredUsers === 'number'
    ? stats.totalRegisteredUsers
    : Array.isArray(stats?.allUsers)
      ? stats.allUsers.length
      : 0;

const onlineUsers = stats?.onlineUsers ?? 0;
const loginEvents = stats?.loginEvents24h ?? 0;
const uniqueUsers = stats?.recentLogins.length
console.log(stats?.recentLogins)

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
  const [restoringId, setRestoringId] = useState(null);

const restoreUser = async (id) => {
  if (!window.confirm('Restore this user account?')) return;

  const token = localStorage.getItem('admin-auth-token');

  try {
    setRestoringId(id);
    setError('');

    const response = await fetch(
      `${API_BASE}/api/auth/admin/restore-user/${id}`,
      {
        method: 'PUT',
        headers: {
          'auth-token': token
        }
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || 'Could not restore user.'
      );
    }

    await loadStats();

    window.alert(data.message || 'User restored successfully!');
  } catch (err) {
    window.alert(err.message || 'Restore failed.');
  } finally {
    setRestoringId(null);
  }
};


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
              activeSection === 'emaildata' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('emaildata')}
          >
            ⚑ &nbsp; Send Messages
            {activeSection === 'emaildata' && <i>•</i>}
          </button>
          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'sendnote' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('sendnote')}
          >
            ⚑ &nbsp; Email Data
            {activeSection === 'sendnote' && <i>•</i>}
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
    activeSection === 'deletedusers' ? 'selected' : ''
  }`}
  onClick={() => setActiveSection('deletedusers')}
>
  🗑️ &nbsp; Deleted Users
  {activeSection === 'deletedusers' && <i>•</i>}
</button>

          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === 'totalnotes' ? 'selected' : ''
            }`}
            onClick={() => setActiveSection('totalnotes')}
          >
           📊 &nbsp; Total Notes
            {activeSection === 'totalnotes' && <i>•</i>}
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
                      <th style={cellStyle}>Action</th>
                      
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
                            <td style={cellStyle}>—</td>
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
              
<div className="notes-slider">
  <div className="notes-slider-header">
    <span>Notes Analytics</span>

    <div className="notes-slider-controls">
      <button
        type="button"
        onClick={() => setNotesSlide(0)}
        disabled={notesSlide === 0}
        aria-label="Previous notes analytics"
      >
        ←
      </button>

      <span>{notesSlide + 1} / 2</span>

      <button
        type="button"
        onClick={() => setNotesSlide(1)}
        disabled={notesSlide === 1}
        aria-label="Next notes analytics"
      >
        →
      </button>
    </div>
  </div>

  <div className="notes-slider-window">
    <div
      className="notes-slider-track"
      style={{
        transform: `translateX(-${notesSlide * 100}%)`
      }}
    >
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
    </div>
  </div>
</div>





              
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
        value={loading && !stats ? '…' : users}
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
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {!stats && loading ? (
            renderTableMessage('Loading users...', 6)
          ) : (stats?.allUsers ?? []).length === 0 ? (
            renderTableMessage('No registered users found.', 6)
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
                    : '—'}
                </td>

                <td style={cellStyle}>
                  {user.role === 'admin' ? (
                    <span>Admin account</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => deleteUser(user)}
                      style={{
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  </>
)}


          {activeSection === 'deletedusers' && (
            <>
              <section className="admin-welcome">
                <div>
                  <p className="admin-kicker">ACCOUNT RECOVERY</p>
                  <h1>Deleted Users <span>🗑️</span></h1>
                  <p className="admin-subtitle">
                    Accounts moved here using soft delete.
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
                <h2>Deleted accounts</h2>
                <p>
                  The backend must return a <code>deletedUsers</code> array from
                  <code> /api/auth/admin/stats</code> for these records to appear.
                </p>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={cellStyle}>#</th>
                      <th style={cellStyle}>User</th>
                      <th style={cellStyle}>Email</th>
                      <th style={cellStyle}>Deleted On</th>
                      <th style={cellStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.deletedUsers ?? []).length === 0 ? (
                      renderTableMessage(
                        loading
                          ? 'Loading deleted users...'
                          : 'No deleted users returned by the backend.',
                        5
                      )
                    ) : (
                      stats.deletedUsers.map((user, index) => (
                        <tr key={user._id || user.email || index}>
                          <td style={cellStyle}>{index + 1}</td>
                          <td style={cellStyle}>{user.name || 'Unknown'}</td>
                          <td style={cellStyle}>{user.email || '—'}</td>
                          <td style={cellStyle}>{formatDate(user.deletedAt)}</td>
                          <td style={cellStyle}>
                            <button
                              type="button"
                              onClick={() => restoreUser(user._id)}
                              disabled={restoringId === user._id}
                            >
                              {restoringId === user._id ? 'Restoring...' : '↻ Restore'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </section>
            </>
          )}

          
{activeSection === 'totalnotes' && ( <>
<section className="admin-welcome">
                <div>
                  <p className="admin-kicker">NOTES HISTORY</p>
                  <h1>
                   Total Notes History <span>✦</span>
                  </h1>
                  <p className="admin-subtitle">
                   All active and permanently deleted notes with user details.
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
      value={notesHistory?.totalNotes ?? 0}
      detail="All recorded notes"
      icon="📝"
      />


      <StatCard
       label="Active Notes"
      value={notesHistory?.activeNotes ?? 0}
      detail="Currently available notes"
      icon="✓"
      />

      <StatCard
         label="Deleted Notes"
      value={notesHistory?.deletedNotes ?? 0}
      detail="Notes removed by users"
      icon="⌫"
      />
    </section>




  <section style={sectionStyle}>




  <table style={tableStyle}>
    <thead>
      <tr>
        <th style={cellStyle}>#</th>
        <th style={cellStyle}>Title</th>
        <th style={cellStyle}>Username</th>
        <th style={cellStyle}>Created Date</th>
        <th style={cellStyle}>Deleted Date</th>
        <th style={cellStyle}>Status</th>
      </tr>
    </thead>

    <tbody>
      {!notesHistory ? (
        renderTableMessage('Loading notes history...', 6)
      ) : notesHistory.notes.length === 0 ? (
        renderTableMessage('No notes history found.', 6)
      ) : (
        notesHistory.notes.map((note, index) => (
          <tr key={note.id}>
            <td style={cellStyle}>{index + 1}</td>

            <td style={cellStyle}>
              <strong>{note.title || 'Untitled'}</strong>
            </td>

            <td style={cellStyle}>
              {note.username || 'Unknown'}
            </td>

            <td style={cellStyle}>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleString()
                : '—'}
            </td>

            <td style={cellStyle}>
              {note.deletedAt
                ? new Date(note.deletedAt).toLocaleString()
                : '—'}
            </td>

            <td style={cellStyle}>
              <span
                style={{
                  color: note.status === 'active' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}
              >
                {note.status === 'active' ? 'Active' : 'Deleted'}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</section>
</>
)} {activeSection === 'emaildata' && (<EmailHistory/>) }
{activeSection === 'sendnote' && (<SendNotesHistory/>) }

          

         <Footer/>
        </div>
      </main>
    </div>
  );
}
