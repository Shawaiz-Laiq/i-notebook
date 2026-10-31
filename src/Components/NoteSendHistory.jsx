import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const API = "https://firest-backend.vercel.app";

export default function NoteSendHistory() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const getToken = () => localStorage.getItem("auth-token");
  const getReceiverId = (receiver) => {
    return typeof receiver === "string"
      ? receiver
      : receiver?._id;
  };
  // Fetch sent notes
  const loadSent = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const res = await fetch(`${API}/api/sendnotes/sent`, {
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
    loadSent();

    const interval = setInterval(() => {
      loadSent();
    }, 60000);

    return () => clearInterval(interval);
  }, [loadSent]);

  // Group notes by receiver
  const grouped = notes.reduce((acc, note) => {
    const id = getReceiverId(note.receiver);

    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        receiverId: id,
        receiverName:
          note.receiverName ||
          note.receiver?.name ||
          "Unknown User",
        notes: []
      };
    }

    acc[id].notes.push(note);
    return acc;
  }, {});

  // Sort oldest to newest
  const receivers = Object.values(grouped).map(receiver => ({
    ...receiver,
    notes: [...receiver.notes].sort(
      (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
    )
  }));

  const selectedChat = selectedReceiverId
    ? receivers.find(
        receiver => receiver.receiverId === selectedReceiverId
      )
    : null;

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [selectedReceiverId, notes]);

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

  // Open chat
  const openChat = (receiverId) => {
    setSelectedReceiverId(receiverId);
    setMobileChatOpen(true);
  };

  // Back to sent notes
  const backToNotes = () => {
    setMobileChatOpen(false);
    setSelectedReceiverId(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <style>{`
        .send-history-container {
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

        .send-history-sidebar {
          width: 35%;
          min-width: 280px;
          background: #fff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }

        .send-history-list {
          flex: 1;
          overflow-y: auto;
        }

        .send-history-chat {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #efeae2;
        }

        .send-history-item {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          align-items: center;
          border-bottom: 1px solid #f5f6f6;
          transition: background 0.2s;
        }

        .send-history-item:hover {
          background: #f5f6f6;
        }

        .send-history-avatar {
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

        .send-chat-header {
          padding: 12px 20px;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .send-chat-messages {
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

        .send-chat-message {
          display: flex;
          justify-content: flex-end;
        }

        .send-chat-bubble {
          max-width: 70%;
          overflow-wrap: anywhere;
          background: #d9fdd3;
          padding: 10px 14px;
          border-radius: 8px 8px 0 8px;
          box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
        }

        .send-back-button {
          display: none;
          border: none;
          background: transparent;
          font-size: 29px;
          cursor: pointer;
          color: #111b21;
          padding: 0 5px;
          line-height: 1;
        }

        .send-empty-chat {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667781;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 650px) {
          .send-history-container {
            position: relative;
            width: 100%;
            height: calc(100dvh - 70px);
            min-height: 0;
            max-height: none;
            border-radius: 0;
            border: none;
          }

          .send-history-sidebar {
            width: 100%;
            min-width: 0;
            height: 100%;
            border-right: none;
          }

          .send-history-chat {
            display: none;
            width: 100%;
            height: 100%;
          }

          .send-history-container.mobile-chat-open .send-history-sidebar {
            display: none;
          }

          .send-history-container.mobile-chat-open .send-history-chat {
            display: flex;
          }

          .send-back-button {
            display: block;
          }

          .send-chat-header {
            padding: 10px 12px;
          }

          .send-chat-messages {
            padding: 12px;
          }

          .send-chat-bubble {
            max-width: 88%;
          }
        }
      `}</style>

      <div
        className={`send-history-container ${
          mobileChatOpen ? "mobile-chat-open" : ""
        }`}
      >

        {/* LEFT SIDEBAR */}
        <div className="send-history-sidebar">

          <div style={{
            padding: "16px",
            background: "#f0f2f5",
            fontWeight: 700,
            fontSize: "18px",
            color: "#111b21",
            borderBottom: "1px solid #e5e7eb",
            flexShrink: 0
          }}>
            Sent Notes
          </div>

          <div className="send-history-list">

            {error ? (
              <p style={{ padding: 16, color: "red" }}>
                {error}
              </p>
            ) : receivers.length === 0 ? (
              <p style={{ padding: 16, color: "#667781" }}>
                No notes sent.
              </p>
            ) : (
              receivers.map(receiver => {
                const lastNote =
                  receiver.notes[receiver.notes.length - 1];

                return (
                  <div
                    key={receiver.receiverId}
                    className="send-history-item"
                    onClick={() => openChat(receiver.receiverId)}
                    style={{
                      background:
                        selectedReceiverId === receiver.receiverId
                          ? "#e9edef"
                          : "#fff"
                    }}
                  >

                    <div className="send-history-avatar">
                      {receiver.receiverName?.[0]?.toUpperCase() || "U"}
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
                        textOverflow: "ellipsis"
                      }}>
                        {receiver.receiverName}
                      </p>

                      <small style={{
                        color: "#667781",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block"
                      }}>
                        {lastNote?.title} - {receiver.notes.length} notes
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
        <div className="send-history-chat">

          {!selectedChat ? (
            <div className="send-empty-chat">
              Your Chat Will Show Here
            </div>
          ) : (
            <>

              {/* CHAT HEADER */}
              <div className="send-chat-header">

                <button
                  className="send-back-button"
                  onClick={backToNotes}
                  aria-label="Back to sent notes"
                  title="Back"
                >
                  ←
                </button>

                <div className="send-history-avatar" style={{
                  width: "40px",
                  height: "40px"
                }}>
                  {selectedChat.receiverName?.[0]?.toUpperCase() || "U"}
                </div>

                <div>
                  <p style={{
                    margin: 0,
                    fontWeight: 700,
                    color: "#111b21"
                  }}>
                    {selectedChat.receiverName}
                  </p>

                  <small style={{ color: "#667781" }}>
                    {selectedChat.notes.length} notes sent
                  </small>
                </div>

              </div>

              {/* MESSAGES */}
              <div className="send-chat-messages">

                {selectedChat.notes.map(note => (
                  <div
                    key={note._id}
                    className="send-chat-message"
                  >

                    <div className="send-chat-bubble">

                      <p style={{
                        margin: "0 0 4px",
                        fontWeight: 700,
                        color: "#2563eb",
                        fontSize: "13px"
                      }}>
                        {note.title}
                      </p>

                      <p style={{
                        margin: 0,
                        color: "#111b21",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.4,
                        fontSize: "14.2px"
                      }}>
                        {note.description}
                      </p>

                      <div style={{
                        textAlign: "right",
                        marginTop: "6px"
                      }}>
                        <small style={{
                          fontSize: "11px",
                          color: "#667781"
                        }}>
                          {formatMessageTime(note.sentAt)}
                          {" "}
                          {note.isRead === true ? "✓✓" : "✓"}
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
    </>
  );
}
