
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./footer";
import ChatSendNote from "./ChatSendNote";

const API = "https://firest-backend.vercel.app";

export default function NoteChat() {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [error, setError] = useState("");
  const [showSendNote, setShowSendNote] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const getToken = () => localStorage.getItem("auth-token");

  // Get ID whether populated object or string
  const getId = (value) => {
    return typeof value === "string"
      ? value
      : value?._id || value?.id || null;
  };

  // Load both sent and received notes
  const loadChats = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const [sentRes, receivedRes] = await Promise.all([
        fetch(`${API}/api/sendnotes/sent`, {
          headers: { "auth-token": token }
        }),

        fetch(`${API}/api/sendnotes/received`, {
          headers: { "auth-token": token }
        })
      ]);

      const [sentData, receivedData] = await Promise.all([
        sentRes.json(),
        receivedRes.json()
      ]);

      if (!sentRes.ok || !sentData.success) {
        throw new Error(sentData.message || "Could not load sent notes");
      }

      if (!receivedRes.ok || !receivedData.success) {
        throw new Error(receivedData.message || "Could not load received notes");
      }

      const chatMap = {};

      // OUTGOING MESSAGES
      (sentData.notes || []).forEach(note => {
        const partnerId = getId(note.receiver);

        if (!partnerId) return;

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            partnerId,
            partnerName:
              note.receiverName ||
              note.receiver?.name ||
              "Unknown User",
            messages: []
          };
        }

        chatMap[partnerId].messages.push({
          ...note,
          direction: "outgoing",
          messageTime: note.sentAt
        });
      });

      // INCOMING MESSAGES
      (receivedData.notes || []).forEach(note => {
        const partnerId = getId(note.sender);

        if (!partnerId) return;

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            partnerId,
            partnerName:
              note.senderName ||
              note.sender?.name ||
              "Unknown User",
            messages: []
          };
        }

        // Prefer an existing name if available
        if (note.senderName) {
          chatMap[partnerId].partnerName = note.senderName;
        }

        chatMap[partnerId].messages.push({
          ...note,
          direction: "incoming",
          messageTime: note.sentAt
        });
      });

      // Sort all messages in chronological order
      const combinedChats = Object.values(chatMap).map(chat => ({
        ...chat,
        messages: chat.messages.sort(
          (a, b) =>
            new Date(a.messageTime) - new Date(b.messageTime)
        )
      }));

      // Sort chats by latest message
      combinedChats.sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1];
        const lastB = b.messages[b.messages.length - 1];

        return new Date(lastB.messageTime) - new Date(lastA.messageTime);
      });

      setChats(combinedChats);
      setError("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Initial load and auto refresh
  useEffect(() => {
    loadChats();

    const interval = setInterval(loadChats, 60000);

    return () => clearInterval(interval);
  }, [loadChats]);

  // Selected conversation
  const selectedChat = chats.find(
    chat => chat.partnerId === selectedId
  );

  // Format message time
  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const diff = Date.now() - date.getTime();

    if (diff >= 0 && diff < 86400000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    return date.toLocaleDateString();
  };

  // Open conversation and mark incoming messages as read
  const openChat = async (chat) => {
    setSelectedId(chat.partnerId);
    setMobileChatOpen(true);

    const unread = chat.messages.some(
      msg => msg.direction === "incoming" && msg.isRead !== true
    );

    if (!unread) return;

    try {
      const response = await fetch(
        `${API}/api/sendnotes/read/${chat.partnerId}`,
        {
          method: "POST",
          headers: {
            "auth-token": getToken()
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not mark messages as read");
      }

      setChats(prev =>
        prev.map(item =>
          item.partnerId === chat.partnerId
            ? {
                ...item,
                messages: item.messages.map(msg =>
                  msg.direction === "incoming"
                    ? { ...msg, isRead: true }
                    : msg
                )
              }
            : item
        )
      );

    } catch (err) {
      setError(err.message);
    }
  };

useEffect(() => {
  if (selectedChat && selectedChat.messages.length > 0) {
    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end"
    });
  }
}, [selectedId]);

  const backToChats = () => {
    setMobileChatOpen(false);
    setSelectedId(null);
  };

  if (loading) return <Loading />;

  return (
    <>
      <style>{`
        .unified-chat {
          display: flex;
          height: calc(100vh - 70px);
          height: calc(100dvh - 70px);
          max-height: 800px;
          min-height: 400px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          font-family: system-ui, sans-serif;
        }

        .unified-sidebar {
          width: 35%;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          background: white;
          border-right: 1px solid #e5e7eb;
        }

        .unified-list {
          flex: 1;
          overflow-y: auto;
        }

        .unified-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 15px;
          border-bottom: 1px solid #f1f2f3;
          cursor: pointer;
          transition: background .2s;
        }

        .unified-item:hover {
          background: #f5f6f6;
        }

        .unified-avatar {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #2563eb;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        .unified-chat-area {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #efeae2;
        }

        .unified-header {
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f0f2f5;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .unified-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #efeae2;
        }

        .unified-message {
          display: flex;
          width: 100%;
        }

        .unified-message.outgoing {
          justify-content: flex-end;
        }

        .unified-message.incoming {
          justify-content: flex-start;
        }

        .unified-bubble {
          max-width: 72%;
          min-width: 100px;
          padding: 10px 14px;
          border-radius: 9px;
          overflow-wrap: anywhere;
          box-shadow: 0 1px 1px rgba(0,0,0,.10);
        }

        .unified-bubble.outgoing {
          background: #d9fdd3;
          border-radius: 9px 9px 0 9px;
        }

        .unified-bubble.incoming {
          background: white;
          border-radius: 9px 9px 9px 0;
        }

        .unified-back {
          display: none;
          border: none;
          background: transparent;
          font-size: 27px;
          cursor: pointer;
        }

        .unified-empty {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #667781;
        }
          /* Hide scrollbar but keep scrolling */
.unified-messages,
.unified-list {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.unified-messages::-webkit-scrollbar,
.unified-list::-webkit-scrollbar {
  display: none;
}

        @media(max-width:650px) {
          .unified-chat {
            position: relative;
            width: 100%;
            height: calc(100dvh - 70px);
            min-height: 0;
            max-height: none;
            border: none;
            border-radius: 0;
          }

          .unified-sidebar {
            width: 100%;
            min-width: 0;
          }

          .unified-chat-area {
            display: none;
            width: 100%;
            height: 100%;
          }

          .unified-chat.mobile-open .unified-sidebar {
            display: none;
          }

          .unified-chat.mobile-open .unified-chat-area {
            display: flex;
          }

          .unified-back {
            display: block;
          }

          .unified-messages {
            padding: 12px;
          }

          .unified-bubble {
            max-width: 88%;
          }
        }
      `}</style>

      <div className={`unified-chat ${mobileChatOpen ? "mobile-open" : ""}`}>

        {/* LEFT: ALL CONVERSATIONS */}
        <div className="unified-sidebar">

          <div style={{
            padding: "17px",
            background: "#f0f2f5",
            fontWeight: 700,
            fontSize: "19px",
            color: "#111b21",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <span>Chats</span>
            <small style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 400,
              color: "#667781",
              marginTop: 3
            }}>
              Your sent and received notes
            </small>
          </div>

          <div className="unified-list">

            {error && (
              <p style={{ color: "red", padding: 12 }}>{error}</p>
            )}

            {chats.length === 0 ? (
              <p style={{ padding: 18, color: "#667781" }}>
                No conversations yet.
              </p>
            ) : (
              chats.map(chat => {
                const lastMessage =
                  chat.messages[chat.messages.length - 1];

                const unread = chat.messages.filter(
                  msg =>
                    msg.direction === "incoming" &&
                    msg.isRead !== true
                ).length;

                return (
                  <div
                    key={chat.partnerId}
                    className="unified-item"
                    onClick={() => openChat(chat)}
                    style={{
                      background:
                        selectedId === chat.partnerId
                          ? "#e9edef"
                          : "white"
                    }}
                  >
                    <div className="unified-avatar">
                      {chat.partnerName?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 5
                      }}>
                        <strong style={{
                          color: "#111b21",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {chat.partnerName}
                        </strong>

                        <small style={{
                          color: "#667781",
                          flexShrink: 0
                        }}>
                          {formatTime(lastMessage?.messageTime)}
                        </small>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 5
                      }}>
                        <small style={{
                          color: "#667781",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis"
                        }}>
                          {lastMessage?.direction === "outgoing"
                            ? "You: "
                            : ""}
                          {lastMessage?.title}
                        </small>

                        {unread > 0 && (
                          <span style={{
                            background: "#2563eb",
                            color: "white",
                            borderRadius: 20,
                            padding: "2px 7px",
                            fontSize: 11
                          }}>
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* RIGHT: SINGLE CHAT */}
        <div className="unified-chat-area">

          {!selectedChat ? (
            <div className="unified-empty">
              <div>
                <div style={{ fontSize: 45 }}>💬</div>
                <h4>Your conversations</h4>
                <p>Select a person to view your messages.</p>
              </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="unified-header">

                <button
                  className="unified-back"
                  onClick={backToChats}
                >
                  ←
                </button>

                <div className="unified-avatar" style={{
                  width: 40,
                  height: 40
                }}>
                  {selectedChat.partnerName?.[0]?.toUpperCase() || "U"}
                </div>

                <div>
                  <strong style={{ color: "#111b21" }}>
                    {selectedChat.partnerName}
                  </strong>

                  <small style={{
                    display: "block",
                    color: "#667781"
                  }}>
                    {selectedChat.messages.length} notes exchanged
                  </small>
                </div>
              </div>

              {/* CHAT MESSAGES */}
              <div className="unified-messages">

                {selectedChat.messages.map(msg => {
                  const outgoing = msg.direction === "outgoing";

                  return (
                    <div
                      key={`${msg.direction}-${msg._id}`}
                      className={`unified-message ${
                        outgoing ? "outgoing" : "incoming"
                      }`}
                    >
                      <div className={`unified-bubble ${
                        outgoing ? "outgoing" : "incoming"
                      }`}>

                        <p style={{
                          margin: "0 0 5px",
                          fontWeight: 700,
                          fontSize: 13,
                          color: outgoing ? "#2563eb" : "#15803d"
                        }}>
                          {msg.title}
                        </p>

                        <p style={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                          color: "#111b21",
                          fontSize: 14
                        }}>
                          {msg.description}
                        </p>

                        <div style={{
                          textAlign: "right",
                          marginTop: 6
                        }}>
                          <small style={{
                            color: "#667781",
                            fontSize: 11
                          }}>
                            {formatTime(msg.messageTime)}
                            {outgoing && (
                              <span style={{ marginLeft: 5 }}>
                                {msg.isRead ? "✓✓" : "✓"}
                              </span>
                            )}
                          </small>
                        </div>

                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />

              </div>
              <div style={{
  padding: "12px",
  background: "#f0f2f5",
  borderTop: "1px solid #ddd",
  textAlign: "center"
}}>
  <button
    onClick={() => setShowSendNote(true)}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "11px 22px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 600
    }}
  >
    + Send Your Notes
  </button>
</div>

{showSendNote && (
  <ChatSendNote
    recipientId={selectedChat.partnerId}
    recipientName={selectedChat.partnerName}
    onClose={() => setShowSendNote(false)}
    onSent={() => loadChats()}
  />
)}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
