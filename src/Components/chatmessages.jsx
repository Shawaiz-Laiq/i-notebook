
import React, { useCallback, useEffect, useState } from "react";
import "./EmailHistory.css";

const API = "https://firest-backend.vercel.app";

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleString();
};

const StatCard = ({ label, value, detail, icon }) => (
  <article className="admin-stat">
    <div className="admin-stat-label">
      {label} <span>{icon}</span>
    </div>

    <strong className="admin-number">{value}</strong>

    <small>{detail}</small>
  </article>
);

export default function ChatMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // LOAD CHAT MESSAGES
  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin-auth-token");

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(
        `${API}/api/auth/admin/messages`,
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
          result.message || "Messages could not be loaded."
        );
      }

      setMessages(result.messages || []);

    } catch (err) {
      console.error("Chat messages error:", err);
      setError(err.message || "Messages load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD ON COMPONENT MOUNT
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // MESSAGE STATISTICS
  const total = messages.length;

  const read = messages.filter(
    (msg) => msg.isRead === true
  ).length;

  const unread = total - read;

  // SEARCH AND FILTER
  const filteredMessages = messages.filter((msg) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      (msg.senderName || "").toLowerCase().includes(query) ||
      (msg.senderEmail || "").toLowerCase().includes(query) ||
      (msg.receiverName || "").toLowerCase().includes(query) ||
      (msg.receiverEmail || "").toLowerCase().includes(query) ||
      (msg.message || "").toLowerCase().includes(query);

    const matchesFilter =
      filter === "all" ||
      (filter === "read" && msg.isRead === true) ||
      (filter === "unread" && msg.isRead !== true);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
     <section className="admin-welcome">
      {/* HEADER */}
      
        <div>
          <p className="admin-kicker">USER COMMUNICATION</p>

          <h1>
            Chat Messages History <span>💬</span>
          </h1>

          <p className="admin-subtitle">
            Monitor messages sent between all users.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh"
          onClick={loadMessages}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh Messages"}
        </button>
      </section>

      {/* ERROR */}
      {error && (
        <section className="email-error" role="alert">
          <strong>Unable to load chat messages</strong>
          <p>{error}</p>

          <button
            type="button"
            onClick={loadMessages}
            disabled={loading}
          >
            Try Again
          </button>
        </section>
      )}

      {/* STATISTICS */}
      <section className="admin-stats">
        <StatCard
          label="Total Messages"
          value={total}
          detail="All user messages"
          icon="💬"
        />

        <StatCard
          label="Read Messages"
          value={read}
          detail="Opened by recipients"
          icon="✓"
        />

        <StatCard
          label="Unread Messages"
          value={unread}
          detail="Not yet opened"
          icon="!"
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

      {/* SEARCH AND FILTER */}
      <div className="email-filters">
        <div className="email-search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search sender, receiver or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All messages</option>
          <option value="read">Read messages</option>
          <option value="unread">Unread messages</option>
        </select>
      </div>

      {/* CHAT MESSAGES TABLE */}
      <div className="email-table-wrap">
        <table className="email-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Message Content</th>
              <th>Sent At</th>
              <th>Read Status</th>
              <th>Read At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="email-empty">
                  Loading messages...
                </td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan="6" className="email-empty">
                  {error
                    ? "Messages could not be loaded."
                    : "No messages found."}
                </td>
              </tr>
            ) : (
              filteredMessages.map((msg) => (
                <tr key={msg._id}>
                  {/* SENDER */}
                  <td>
                    <div className="email-user">
                      <span className="email-avatar">
                        {(msg.senderName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <div>
                        <strong>
                          {msg.senderName || "Unknown"}
                        </strong>

                        <small>
                          {msg.senderEmail || "No email"}
                        </small>
                      </div>
                    </div>
                  </td>

                  {/* RECEIVER */}
                  <td>
                    <div className="email-user">
                      <span className="email-avatar">
                        {(msg.receiverName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <div>
                        <strong>
                          {msg.receiverName || "Unknown"}
                        </strong>

                        <small>
                          {msg.receiverEmail || "No email"}
                        </small>
                      </div>
                    </div>
                  </td>

                  {/* MESSAGE */}
                  <td
                    style={{
                      minWidth: "220px",
                      maxWidth: "350px",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {msg.message || "—"}
                  </td>

                  {/* SENT DATE */}
                  <td className="email-date">
                    {formatDate(msg.sentAt)}
                  </td>

                  {/* READ STATUS */}
                  <td>
                    <span
                      className={`email-status ${
                        msg.isRead ? "sent" : "failed"
                      }`}
                    >
                      <span />
                      {msg.isRead ? "Read" : "Unread"}
                    </span>
                  </td>

                  {/* READ DATE */}
                  <td className="email-date">
                    {msg.isRead
                      ? formatDate(msg.readAt)
                      : "Not read yet"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="email-footnote">
        Read means the recipient opened the conversation and
        the backend successfully marked the message as read.
      </p>
    </section>
    </>
  );
}
