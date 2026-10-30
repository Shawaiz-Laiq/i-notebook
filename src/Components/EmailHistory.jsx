
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./EmailHistory.css";

const API_URL = "https://firest-backend.vercel.app/api/auth/admin/email-history";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
};

const getErrorMessage = (error) => {
  if (!error) return "No error details available";
  return error;
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
 const sectionStyle = {
    background: '#fff',
    border: '1px solid #e8eaf0',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '24px',
    overflowX: 'auto'
  };

export default function EmailHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notesSlide, setNotesSlide] = useState(0);

  const loadEmailHistory = useCallback(async (requestedPage = page) => {
    setLoading(true);
    setError("");

    try {
      // Change this key if your login system stores the token elsewhere.
      const token = localStorage.getItem("admin-auth-token");

      if (!token) {
        throw new Error(
          'Login token nahi mila. Check karo ke localStorage mein "auth-token" save hai.'
        );
      }

      const response = await fetch(
        `${API_URL}?page=${requestedPage}&limit=20`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Request failed (${response.status})`
        );
      }

      setData(result);
    } catch (err) {
      setError(err.message || "Email history load nahi ho saki.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadEmailHistory(page);
  }, [page, loadEmailHistory]);

  const emails = data?.emails ?? [];
  const summary = data?.summary ?? [];

  const getCount = (type, status) =>
    summary.find(
      (item) => item._id?.type === type && item._id?.status === status
    )?.count ?? 0;

  const sentCount = summary
    .filter((item) => item._id?.status === "sent")
    .reduce((total, item) => total + item.count, 0);

  const failedCount = summary
    .filter((item) => item._id?.status === "failed")
    .reduce((total, item) => total + item.count, 0);

  const verificationCount = getCount("verification", "sent") +
    getCount("verification", "failed");

  const resetCount = getCount("password-reset", "sent") +
    getCount("password-reset", "failed");

  const attemptsByEmail = useMemo(() => {
    const counts = {};

    emails.forEach((item) => {
      const key = (item.email || "").toLowerCase();
      if (key) counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, [emails]);

  const filteredEmails = useMemo(() => {
    const query = search.trim().toLowerCase();

    return emails.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesType =
        typeFilter === "all" || item.type === typeFilter;

      const matchesSearch =
        !query ||
        (item.email || "").toLowerCase().includes(query) ||
        (item.userId?.name || "").toLowerCase().includes(query) ||
        (item.userId?.email || "").toLowerCase().includes(query) ||
        (item.messageId || "").toLowerCase().includes(query) ||
        (item.error || "").toLowerCase().includes(query);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [emails, search, statusFilter, typeFilter]);

  const totalPages = data?.totalPages ?? 1;

  return (
    <>
       <section className="admin-welcome">
        <div>
          <p className="admin-kicker">WORKSPACE ACTIVITY</p>
          <h1>
            Email History <span>✉</span>
          </h1>
          <p className="admin-subtitle">
            Monitor verification emails, password resets and delivery attempts.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh"
          onClick={() => loadEmailHistory(page)}
          disabled={loading}
        >
          ↻ &nbsp; {loading ? "Loading..." : "Refresh data"}
        </button>
      </section>

      {error && (
        <section className="email-error" role="alert">
          <strong>Unable to load email history</strong>
          <p>{error}</p>
          <button type="button" onClick={() => loadEmailHistory(page)}>
            Try again
          </button>
        </section>
      )}

      <section className="admin-stats">
        <StatCard
          label="Total Attempts"
          value={data?.totalEmails ?? "—"}
          detail="All email records"
          icon="✉"
          color="blue"
        />
        <StatCard
          label="Successfully Sent"
          value={loading && !data ? "…" : sentCount}
          detail="Accepted by the mail server"
          icon="✓"
          color="green"
        />
        <StatCard
          label="Failed Attempts"
          value={loading && !data ? "…" : failedCount}
          detail="Emails that failed to send"
          icon="!"
          color="red"
        />
        <StatCard
          label="Email Types"
          value="2"
          detail={`${verificationCount} verification · ${resetCount} password reset`}
          icon="◎"
          color="purple"
        />
      </section>
      <div className="notes-slider">
  <div className="notes-slider-header">
    <span>Email Analytics</span>

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
        <div>
          <div>
            <p className="admin-kicker">DELIVERY BREAKDOWN</p>
            <h2>Email performance</h2>
          </div>
          <span className="email-live-label">
            <span /> Database records
          </span>
        </div>

        <div className="email-breakdown-grid">
          {["verification", "password-reset"].map((type) => {
            const sent = getCount(type, "sent");
            const failed = getCount(type, "failed");
            const total = sent + failed;
            const percent = total ? Math.round((sent / total) * 100) : 0;

            return (
              <article className="email-breakdown-card" key={type}>
                <div className="email-breakdown-title">
                  <span className="email-breakdown-icon">
                    {type === "verification" ? "✓" : "↻"}
                  </span>
                  <div>
                    <h3>
                      {type === "verification"
                        ? "Verification emails"
                        : "Password-reset emails"}
                    </h3>
                    <p>{total} recorded attempts</p>
                  </div>
                </div>

                <div className="email-progress">
                  <div style={{ width: `${percent}%` }} />
                </div>

                <div className="email-breakdown-numbers">
                  <span>Sent <strong>{sent}</strong></span>
                  <span>Failed <strong>{failed}</strong></span>
                  <span><strong>{percent}%</strong> sent</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={sectionStyle}>
        <div >
          <div>
            <p className="admin-kicker">ACTIVITY LOG</p>
            <h2>Email delivery history</h2>
            <p className="email-panel-description">
              Review each attempt, associated user and any delivery error.
            </p>
          </div>
          <span className="email-record-count">
            {data?.totalEmails ?? 0} total records
          </span>
        </div>

        <div className="email-filters">
          <div className="email-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search name, email or error..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search email history"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by email type"
          >
            <option value="all">All email types</option>
            <option value="verification">Verification</option>
            <option value="password-reset">Password reset</option>
          </select>
        </div>

        <div className="email-table-wrap">
          <table className="email-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email address</th>
                <th>Type</th>
                <th>Status</th>
                <th>Attempts on this page</th>
                <th>Date &amp; time</th>
                <th>Error details</th>
              </tr>
            </thead>

            <tbody>
              {loading && !data ? (
                <tr>
                  <td colSpan="7" className="email-empty">
                    Loading email history...
                  </td>
                </tr>
              ) : filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan="7" className="email-empty">
                    {error
                      ? "Email records could not be loaded."
                      : "No matching email records found."}
                  </td>
                </tr>
              ) : (
                filteredEmails.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="email-user">
                        <span className="email-avatar">
                          {(item.userId?.name || item.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <div>
                          <strong>{item.userId?.name || "Unknown user"}</strong>
                          <small>
                            {item.userId?._id
                              ? `ID: ${item.userId._id.slice(-8)}`
                              : "User ID unavailable"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td className="email-address">
                      {item.email || "—"}
                    </td>

                    <td>
                      <span className={`email-type-badge ${item.type}`}>
                        {item.type === "password-reset"
                          ? "Password reset"
                          : item.type === "verification"
                            ? "Verification"
                            : item.type || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <span className={`email-status ${item.status}`}>
                        <span />
                        {item.status || "Unknown"}
                      </span>
                    </td>

                    <td className="email-attempt-number">
                      {attemptsByEmail[(item.email || "").toLowerCase()] ?? 1}
                    </td>

                    <td className="email-date">
                      {formatDate(item.sentAt || item.createdAt)}
                    </td>

                    <td className="email-error-cell">
                      {item.error ? (
                        <span title={getErrorMessage(item.error)}>
                          {getErrorMessage(item.error)}
                        </span>
                      ) : (
                        <span className="email-no-error">No error</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="email-pagination">
          <p>
            Page <strong>{data?.page ?? page}</strong> of{" "}
            <strong>{totalPages}</strong>
          </p>

          <div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={loading || page >= totalPages}
            >
              Next →
            </button>
          </div>
        </div>

        <p className="email-footnote">
          Note: “Sent” means the mail server accepted the message, not
          necessarily that it reached the recipient’s inbox. Attempt counts
          shown here are for the currently loaded page.
        </p>
      </section>
      </div>
  </div>
</div>
    </>
  );
}
