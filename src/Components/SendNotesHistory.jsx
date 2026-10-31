
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./EmailHistory.css";
import './Admin.css';

const API_BASE = "https://firest-backend.vercel.app/api/auth";
const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "—";
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
const sectionStyle = {
    background: '#fff',
    border: '1px solid #e8eaf0',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '24px',
    overflowX: 'auto'
};

export default function SendNotesHistory() {
    const [data, setData] = useState(null);
    const [attemptData, setAttemptData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [notesSlide, setNotesSlide] = useState(0);
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedMessages, setExpandedMessages] = useState({});
    const loadHistory = useCallback(async (requestedPage = page) => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("admin-auth-token");

            if (!token) {
                throw new Error(
                    'Admin token nahi mila. localStorage mein "admin-auth-token" check karo.'
                );
            }

            const headers = {
                "auth-token": token,
                "Content-Type": "application/json"
            };

            const [notesResponse, attemptsResponse] = await Promise.all([
                fetch(
                    `${API_BASE}/admin/sendnotes-history?page=${requestedPage}&limit=20`,
                    { method: "GET", headers }
                ),
                fetch(`${API_BASE}/admin/send-attempts`, {
                    method: "GET",
                    headers
                })
            ]);

            const notesResult = await notesResponse.json();
            const attemptsResult = await attemptsResponse.json();

            if (!notesResponse.ok || !notesResult.success) {
                throw new Error(
                    notesResult.message || "Message history load nahi ho saki."
                );
            }

            if (!attemptsResponse.ok || !attemptsResult.success) {
                throw new Error(
                    attemptsResult.message || "Failed attempts load nahi ho sakin."
                );
            }

            setData(notesResult);
            setAttemptData(attemptsResult);

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadHistory(page);
    }, [page, loadHistory]);

    const notes = useMemo(() => data?.notes ?? [], [data]);
    const attempts = useMemo(
        () => attemptData?.attempts ?? [],
        [attemptData]
    );

    const readCount = data?.totalRead ?? 0;
    const unreadCount = data?.totalUnread ?? 0;
    const failedCount = attemptData?.totalAttempts ?? 0;
    const filteredNotes = useMemo(() => {
        const query = search.trim().toLowerCase();

        return notes.filter((note) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "read" && note.isRead) ||
                (statusFilter === "unread" && !note.isRead);

            const matchesSearch =
                !query ||
                (note.senderName || "").toLowerCase().includes(query) ||
                (note.receiverName || "").toLowerCase().includes(query) ||
                (note.title || "").toLowerCase().includes(query) ||
                (note.description || "").toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [notes, search, statusFilter]);

    const filteredAttempts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return attempts.filter((item) => {
            const senderName = item.sender?.name || "";
            const senderEmail = item.sender?.email || "";
            const receiver = item.attemptedReceiver || "";
            const reason = item.reason || "";

            return (
                !query ||
                senderName.toLowerCase().includes(query) ||
                senderEmail.toLowerCase().includes(query) ||
                receiver.toLowerCase().includes(query) ||
                reason.toLowerCase().includes(query)
            );
        });
    }, [attempts, search]);

    const attemptsByUser = useMemo(() => {
        const counts = {};

        attempts.forEach((item) => {
            const key = item.sender?._id || item.sender || "unknown";
            counts[key] = (counts[key] || 0) + 1;
        });

        return counts;
    }, [attempts]);

    const totalPages = data?.totalPages ?? 1;

    return (
        <>
            <section className="admin-welcome">
                <div>
                    <p className="admin-kicker">WORKSPACE ACTIVITY</p>
                    <h1>
                        Send Notes History <span>✉</span>
                    </h1>
                    <p className="admin-subtitle">
                        Monitor messages, recipients, read status and failed send attempts.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-refresh"
                    onClick={() => loadHistory(page)}
                    disabled={loading}
                >
                    ↻ &nbsp; {loading ? "Loading..." : "Refresh data"}
                </button>
            </section>

            {error && (
                <section className="email-error" role="alert">
                    <strong>Unable to load message history</strong>
                    <p>{error}</p>

                    <button type="button" onClick={() => loadHistory(page)}>
                        Try again
                    </button>
                </section>
            )}

            {/* STATISTICS */}
            <section className="admin-stats">
                <StatCard
                    label="Total Messages"
                    value={data?.totalNotes ?? "—"}
                    detail="All sent message records"
                    icon="✉"
                    color="blue"
                />

                <StatCard
                    label="Read Messages"
                    value={loading && !data ? "…" : readCount}
                    detail="Messages opened by recipients"
                    icon="✓"
                    color="green"
                />

                <StatCard
                    label="Unread Messages"
                    value={loading && !data ? "…" : unreadCount}
                    detail="Waiting to be read"
                    icon="!"
                    color="purple"
                />

                <StatCard
                    label="Failed Attempts"
                    value={attemptData?.totalAttempts ?? "—"}
                    detail="Invalid recipient attempts"
                    icon="⚠"
                    color="red"
                />
            </section>
            <div className="notes-slider">
                <div className="notes-slider-header">
                    <span>Messages Analytics</span>

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
                        }}>

                        {/* MESSAGE HISTORY */}
                        <section style={sectionStyle}>
                            <div className="">
                                <div>
                                    <p className="admin-kicker">MESSAGE ACTIVITY</p>
                                    <h2>Sent and received messages</h2>

                                    <p className="email-panel-description">
                                        Check who sent a message, its recipient and whether it was read.
                                    </p>
                                </div>

                                <span className="email-record-count">
                                    {data?.totalNotes ?? 0} total messages
                                </span>
                            </div>

                            <div className="email-filters">
                                <div className="email-search">
                                    <span>⌕</span>

                                    <input
                                        type="search"
                                        placeholder="Search sender, receiver or message..."
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        aria-label="Search message history"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    aria-label="Filter messages"
                                >
                                    <option value="all">All messages</option>
                                    <option value="read">Read</option>
                                    <option value="unread">Unread</option>
                                </select>
                            </div>

                            <div className="email-table-wrap">
                                <table className="email-table">
                                    <thead>
                                        <tr>
                                            <th>Sender</th>
                                            <th>Receiver</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Sent At</th>
                                            <th>Read At</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading && !data ? (
                                            <tr>
                                                <td colSpan="6" className="email-empty">
                                                    Loading messages...
                                                </td>
                                            </tr>
                                        ) : filteredNotes.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="email-empty">
                                                    No matching messages found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredNotes.map((note) => (
                                                <tr key={note._id}>
                                                    <td>
                                                        <div className="email-user">
                                                            <span className="email-avatar">
                                                                {(note.senderName || "?")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>

                                                            <div>
                                                                <strong>{note.senderName || "Unknown"}</strong>
                                                                <small>
                                                                    ID: {note.sender?.toString().slice(-8) || "—"}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="email-user">
                                                            <span className="email-avatar">
                                                                {(note.receiverName || "?")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>

                                                            <div>
                                                                <strong>{note.receiverName || "Unknown"}</strong>
                                                                <small>
                                                                    ID: {note.receiver?.toString().slice(-8) || "—"}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="message-content-cell">
                                                        <strong>{note.title || "No title"}</strong>

                                                        <p
                                                            className={`message-preview ${expandedMessages[note._id] ? "expanded" : ""
                                                                }`}
                                                            onClick={() =>
                                                                setExpandedMessages(prev => ({
                                                                    ...prev,
                                                                    [note._id]: !prev[note._id]
                                                                }))
                                                            }
                                                            title="Click to expand or collapse"
                                                        >
                                                            {note.description || "No message"}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`email-status ${note.isRead ? "sent" : "failed"
                                                                }`}
                                                        >
                                                            <span />
                                                            {note.isRead ? "Read" : "Unread"}
                                                        </span>
                                                    </td>

                                                    <td className="email-date">
                                                        {formatDate(note.sentAt)}
                                                    </td>

                                                    <td className="email-date">
                                                        {note.isRead ? formatDate(note.readAt) : "Not read yet"}
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
                        </section>

                        {/* FAILED ATTEMPTS */}
                        <section style={sectionStyle}>
                            <div>
                                <div>
                                    <p className="admin-kicker">SECURITY ACTIVITY</p>
                                    <h2>Failed message attempts</h2>

                                    <p className="email-panel-description">
                                        Users who tried sending notes to invalid or unavailable recipients.
                                    </p>
                                </div>

                                <span className="email-record-count">
                                    {failedCount} total attempts
                                </span>
                            </div>

                            <div className="email-table-wrap">
                                <table className="email-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>User Email</th>
                                            <th>Attempted Recipient</th>
                                            <th>Attempts by User</th>
                                            <th>Reason</th>
                                            <th>Date &amp; Time</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredAttempts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="email-empty">
                                                    No failed attempts found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAttempts.map((item) => {
                                                const senderId =
                                                    item.sender?._id || item.sender || "unknown";

                                                return (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <div className="email-user">
                                                                <span className="email-avatar">
                                                                    {(item.sender?.name || "?")
                                                                        .charAt(0)
                                                                        .toUpperCase()}
                                                                </span>

                                                                <div>
                                                                    <strong>
                                                                        {item.sender?.name || "Unknown user"}
                                                                    </strong>
                                                                    <small>
                                                                        ID: {String(senderId).slice(-8)}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="email-address">
                                                            {item.sender?.email || "—"}
                                                        </td>

                                                        <td className="email-address">
                                                            {item.attemptedReceiver || "—"}
                                                        </td>

                                                        <td className="email-attempt-number">
                                                            {attemptsByUser[senderId] ?? 1}
                                                        </td>

                                                        <td className="email-error-cell">
                                                            {item.reason || "Unknown reason"}
                                                        </td>

                                                        <td className="email-date">
                                                            {formatDate(item.attemptedAt)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
