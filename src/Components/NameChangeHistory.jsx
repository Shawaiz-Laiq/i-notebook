
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./EmailHistory.css";

const API_URL =
  "https://firest-backend.vercel.app/api/auth/admin/name-change-history";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
};

const StatCard = ({ label, value, detail, icon, featured = false }) => {
  return (
    <article className={`admin-stat ${featured ? "featured" : ""}`}>
      <div className="admin-stat-label">
        {label} <span>{icon}</span>
      </div>

      <strong className="admin-number">{value}</strong>

      <small>{detail}</small>

      {featured && <div className="admin-watermark">USERS</div>}
    </article>
  );
};

export default function NameChangeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin-auth-token");

      if (!token) {
        throw new Error("Admin login token nahi mila.");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Request failed (${response.status})`
        );
      }

      setHistory(result.history || []);

    } catch (err) {
      setError(err.message || "Username history load nahi ho saki.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Search filter
  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return history;

    return history.filter((item) => {
      return (
        (item.userName || item.user?.name || "")
          .toLowerCase().includes(query) ||

        (item.userEmail || item.user?.email || "")
          .toLowerCase().includes(query) ||

        (item.oldName || "").toLowerCase().includes(query) ||

        (item.newName || "").toLowerCase().includes(query)
      );
    });
  }, [history, search]);

  // Total unique users
  const uniqueUsers = useMemo(() => {
    return new Set(
      history.map((item) => item.user?._id || item.user?.toString() || item.userEmail)
    ).size;
  }, [history]);

  // Latest name change
  const latestChange = history.length
    ? formatDate(history[0].changedAt)
    : "No changes yet";

  return (
    <>
      <section className="admin-welcome">
        <div>
          <p className="admin-kicker">USER ACCOUNT ACTIVITY</p>

          <h1>
            Username Change History <span>✏️</span>
          </h1>

          <p className="admin-subtitle">
            Monitor username changes made by registered users.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh"
          onClick={loadHistory}
          disabled={loading}
        >
          ↻ &nbsp; {loading ? "Loading..." : "Refresh data"}
        </button>
      </section>

      {error && (
        <section className="email-error" role="alert">
          <strong>Unable to load username history</strong>
          <p>{error}</p>

          <button type="button" onClick={loadHistory}>
            Try again
          </button>
        </section>
      )}

      <section className="admin-stats">
        <StatCard
          label="Total Changes"
          value={loading && history.length === 0 ? "…" : history.length}
          detail="All recorded username changes"
          icon="✏️"
        />

        <StatCard
          label="Users Changed"
          value={loading && history.length === 0 ? "…" : uniqueUsers}
          detail="Unique users with changes"
          icon="👥"
        />

        <StatCard
          label="Latest Activity"
          value={history.length ? "Active" : "—"}
          detail={latestChange}
          icon="🕒"
        />

        <StatCard
          label="Matching Records"
          value={filteredHistory.length}
          detail="Based on current search"
          icon="◎"
        />
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e8eaf0",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          overflowX: "auto"
        }}
      >
        <div>
          <p className="admin-kicker">ACTIVITY LOG</p>

          <h2>Username change records</h2>

          <p className="email-panel-description">
            Review previous usernames, new usernames and the users who
            changed them.
          </p>
        </div>

        <div className="email-filters">
          <div className="email-search">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search username or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search username history"
            />
          </div>

          <span className="email-record-count">
            {history.length} total records
          </span>
        </div>

        <div className="email-table-wrap">
          <table className="email-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Previous Username</th>
                <th>New Username</th>
                <th>Date &amp; Time</th>
              </tr>
            </thead>

            <tbody>
              {loading && history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="email-empty">
                    Loading username history...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="email-empty">
                    {error
                      ? "Username records could not be loaded."
                      : "No matching username changes found."}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="email-user">
                        <span className="email-avatar">
                          {(item.userName || item.newName || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div>
                          <strong>
                            {item.userName || item.user?.name || "Unknown user"}
                          </strong>

                          <small>
                            {item.user?._id
                              ? `ID: ${item.user._id.slice(-8)}`
                              : item.user?.toString
                                ? `ID: ${String(item.user).slice(-8)}`
                                : "User ID unavailable"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td className="email-address">
                      {item.userEmail || item.user?.email || "—"}
                    </td>

                    <td>
                      <span className="email-type-badge">
                        {item.oldName || "—"}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: "#15803d" }}>
                        {item.newName || "—"}
                      </strong>
                    </td>

                    <td className="email-date">
                      {formatDate(item.changedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="email-footnote">
          All records are fetched from the username change history
          collection. Search filters the loaded records.
        </p>
      </section>
    </>
  );
}
