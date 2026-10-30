
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./footer";

const API = "https://firest-backend.vercel.app";

export default function NoteReceive() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const getToken = () => localStorage.getItem("auth-token");

  const getSenderId = (sender) => {
    return typeof sender === "string" ? sender : sender?._id;
  };

  // Fetch received notes
  const loadReceived = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const res = await fetch(`${API}/api/sendnotes/received`, {
        method: "GET",
        headers: {
          "auth-token": token
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Internal server error. Please wait."
        );
      }

      setNotes(data.notes || []);
      setError("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Initial load + auto refresh
  useEffect(() => {
    loadReceived();

    const interval = setInterval(() => {
      loadReceived();
    }, 60000);

    return () => clearInterval(interval);
  }, [loadReceived]);

  // Mark sender's notes as read in MongoDB
  const handleSelectSender = async (senderId) => {
    if (!getToken()) {
      navigate("/", { replace: true });
      return;
    }

    setSelectedSenderId(senderId);
    setMobileChatOpen(true);

    try {
      const res = await fetch(
        `${API}/api/sendnotes/read/${senderId}`,
        {
          method: "POST",
          headers: {
            "auth-token": getToken()
          }
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Internal server error. Please wait."
        );
      }

      // Update frontend after successful database update
      setNotes(prev =>
        prev.map(note =>
          getSenderId(note.sender) === senderId
            ? { ...note, isRead: true }
            : note
        )
      );

    } catch (err) {
      console.error("Read status error:", err);
      setError(err.message);
    }
  };

  // Back to received notes
  const backToNotes = () => {
    setMobileChatOpen(false);
    setSelectedSenderId(null);
  };

  // Group notes by sender
  const grouped = notes.reduce((acc, note) => {
    const id = getSenderId(note.sender);

    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        senderId: id,
        senderName: note.senderName,
        notes: []
      };
    }

    acc[id].notes.push(note);
    return acc;
  }, {});

  // Sort oldest to newest
  const senders = Object.values(grouped).map(sender => ({
    ...sender,
    notes: [...sender.notes].sort(
      (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
    )
  }));

  const selectedChat = selectedSenderId
    ? senders.find(s => s.senderId === selectedSenderId)
    : null;

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [selectedSenderId, notes]);

  // Message time
  const formatMessageTime = (sentAt) => {
    const messageDate = new Date(sentAt);
    const difference = Date.now() - messageDate.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (difference >= 0 && difference < twentyFourHours) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    return messageDate.toLocaleDateString();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <style>{`
        .receive-history-container {
          display: flex;
          height: calc(100vh - 70px);
          height: calc(100dvh - 70px);
          max-height: 800px;
          min-height: 400px;
          background: #f0f2f5;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          font-family: system-ui, sans-serif;
        }

        .receive-history-sidebar {
          width: 35%;
          min-width: 280px;
          background: #fff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }

        .receive-history-list {
          flex: 1;
          overflow-y: auto;
        }

        .receive-history-chat {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #efeae2;
        }

        .receive-history-item {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          align-items: center;
          border-bottom: 1px solid #f5f6f6;
          transition: background 0.2s;
        }

        .receive-history-item:hover {
          background: #f5f6f6;
        }

        .receive-history-avatar {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .receive-chat-header {
          padding: 12px 20px;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .receive-chat-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
          background-repeat: repeat;
          background-color: #efeae2;
        }

        .receive-chat-message {
          display: flex;
          justify-content: flex-start;
        }

        .receive-chat-bubble {
          max-width: 70%;
          overflow-wrap: anywhere;
          background: #fff;
          padding: 10px 14px;
          border-radius: 8px 8px 8px 0;
          box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
        }

        .receive-back-button {
          display: none;
          border: none;
          background: transparent;
          font-size: 29px;
          cursor: pointer;
          color: #111b21;
          padding: 0 5px;
          line-height: 1;
        }

        .receive-empty-chat {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667781;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 650px) {
          .receive-history-container {
            position: relative;
            width: 100%;
            height: calc(100dvh - 70px);
            min-height: 0;
            max-height: none;
            border-radius: 0;
            border: none;
          }

          .receive-history-sidebar {
            width: 100%;
            min-width: 0;
            height: 100%;
            border-right: none;
          }

          .receive-history-chat {
            display: none;
            width: 100%;
            height: 100%;
          }

          .receive-history-container.mobile-chat-open .receive-history-sidebar {
            display: none;
          }

          .receive-history-container.mobile-chat-open .receive-history-chat {
            display: flex;
          }

          .receive-back-button {
            display: block;
          }

          .receive-chat-header {
            padding: 10px 12px;
          }

          .receive-chat-messages {
            padding: 12px;
          }

          .receive-chat-bubble {
            max-width: 88%;
          }
        }
      `}</style>

      <div
        className={`receive-history-container ${
          mobileChatOpen ? "mobile-chat-open" : ""
        }`}
      >

        {/* LEFT SIDEBAR */}
        <div className="receive-history-sidebar">

          <div style={{
            padding: "16px",
            background: "#f0f2f5",
            fontWeight: 700,
            fontSize: "18px",
            color: "#111b21",
            borderBottom: "1px solid #e5e7eb",
            flexShrink: 0
          }}>
            Received Notes
          </div>

          <div className="receive-history-list">

            {error ? (
              <p style={{ padding: 16, color: "red" }}>
                {error}
              </p>
            ) : senders.length === 0 ? (
              <p style={{ padding: 16, color: "#667781" }}>
                No notes received.
              </p>
            ) : (
              senders.map(s => {
                const unread = s.notes.filter(
                  note => note.isRead !== true
                ).length;

                const lastNote = s.notes[s.notes.length - 1];

                return (
                  <div
                    key={s.senderId}
                    className="receive-history-item"
                    onClick={() => handleSelectSender(s.senderId)}
                    style={{
                      background:
                        selectedSenderId === s.senderId
                          ? "#e9edef"
                          : "#fff"
                    }}
                  >

                    <div className="receive-history-avatar">
                      {s.senderName?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div style={{
                      minWidth: 0,
                      flex: 1
                    }}>
                      <p style={{
                        margin: 0,
                        fontWeight: 600,
                        color: "#111b21",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "flex",
                        alignItems: "center",
                        gap: "7px"
                      }}>
                        {s.senderName}

                        {unread > 0 && (
                          <span style={{
                            minWidth: "21px",
                            height: "21px",
                            padding: "0 5px",
                            borderRadius: "50px",
                            background: "#2563eb",
                            color: "#fff",
                            fontSize: "11px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700
                          }}>
                            {unread}
                          </span>
                        )}
                      </p>

                      <small style={{
                        color: "#667781",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block"
                      }}>
                        {lastNote?.title} - {s.notes.length} notes
                      </small>
                    </div>

                    <small style={{
                      color: "#667781",
                      fontSize: "11px",
                      flexShrink: 0
                    }}>
                      {formatMessageTime(lastNote?.sentAt)}
                    </small>

                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="receive-history-chat">

          {!selectedChat ? (
            <div className="receive-empty-chat">
              Received Note Will Show Here
            </div>
          ) : (
            <>

              {/* CHAT HEADER */}
              <div className="receive-chat-header">

                <button
                  className="receive-back-button"
                  onClick={backToNotes}
                  aria-label="Back to received notes"
                  title="Back"
                >
                  ←
                </button>

                <div className="receive-history-avatar" style={{
                  width: "40px",
                  height: "40px"
                }}>
                  {selectedChat.senderName?.[0]?.toUpperCase() || "U"}
                </div>

                <div>
                  <p style={{
                    margin: 0,
                    fontWeight: 700,
                    color: "#111b21"
                  }}>
                    {selectedChat.senderName}
                  </p>

                  <small style={{ color: "#667781" }}>
                    {selectedChat.notes.length} notes received
                  </small>
                </div>

              </div>

              {/* MESSAGES */}
              <div className="receive-chat-messages">

                {selectedChat.notes.map(n => (
                  <div
                    key={n._id}
                    className="receive-chat-message"
                  >
                    <div className="receive-chat-bubble">

                      <p style={{
                        margin: "0 0 4px",
                        fontWeight: 700,
                        color: "#2563eb",
                        fontSize: "13px"
                      }}>
                        {n.title}
                      </p>

                      <p style={{
                        margin: 0,
                        color: "#111b21",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.4,
                        fontSize: "14.2px"
                      }}>
                        {n.description}
                      </p>

                      <div style={{
                        textAlign: "right",
                        marginTop: "6px"
                      }}>
                        <small style={{
                          fontSize: "11px",
                          color: "#667781"
                        }}>
                          {formatMessageTime(n.sentAt)}
                        </small>
                      </div>

                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />

              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
