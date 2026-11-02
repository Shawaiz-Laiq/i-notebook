
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import ChatSendNote from "./ChatSendNote";


const API = "https://firest-backend.vercel.app";

export default function NoteChat() {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [error, setError] = useState("");
  const [showSendNote, setShowSendNote] = useState(false);


  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const previousMessageCount = useRef(0);

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
      const [sentRes, receivedRes, messagesRes] = await Promise.all([
        fetch(`${API}/api/sendnotes/sent`, {
          headers: { "auth-token": token }
        }),

        fetch(`${API}/api/sendnotes/received`, {
          headers: { "auth-token": token }
        }),

        fetch(`${API}/api/sendnotes/messages`, {
          headers: { "auth-token": token }
        })
      ]);

      const [sentData, receivedData, messagesData] = await Promise.all([
        sentRes.json(),
        receivedRes.json(),
        messagesRes.json()
      ]);

      if (!sentRes.ok || !sentData.success) {
        throw new Error(sentData.message || "Could not load sent notes");
      }

      if (!receivedRes.ok || !receivedData.success) {
        throw new Error(receivedData.message || "Could not load received notes");
      }

      if (!messagesRes.ok || !messagesData.success) {
        throw new Error(messagesData.message || "Could not load text messages");
      }

      const chatMap = {};

      // OUTGOING NOTES
      (sentData.notes || []).forEach(note => {
        const partnerId = getId(note.receiver);
        if (!partnerId) return;

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            partnerId,
            partnerName: note.receiverName || note.receiver?.name || "Unknown User",
            messages: []
          };
        }

        chatMap[partnerId].messages.push({
          ...note,
          direction: "outgoing",
          messageType: "note",
          messageTime: note.sentAt
        });
      });

      // INCOMING NOTES
      (receivedData.notes || []).forEach(note => {
        const partnerId = getId(note.sender);
        if (!partnerId) return;

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            partnerId,
            partnerName: note.senderName || note.sender?.name || "Unknown User",
            messages: []
          };
        }

        chatMap[partnerId].messages.push({
          ...note,
          direction: "incoming",
          messageType: "note",
          messageTime: note.sentAt
        });
      });

      // TEXT MESSAGES: SENT AND RECEIVED
      (messagesData.messages || []).forEach(msg => {
        const outgoing = msg.direction === "outgoing";

        const partnerId = outgoing
          ? getId(msg.receiver)
          : getId(msg.sender);

        if (!partnerId) return;

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            partnerId,
            partnerName: outgoing
              ? msg.receiverName || "Unknown User"
              : msg.senderName || "Unknown User",
            messages: []
          };
        }

        chatMap[partnerId].messages.push({
          ...msg,
          direction: msg.direction,
          messageType: "text",
          title: "Text Message",
          description: msg.message,
          messageTime: msg.sentAt
        });
      });

      // SORT MESSAGES
      const combinedChats = Object.values(chatMap).map(chat => ({
        ...chat,
        messages: chat.messages.sort(
          (a, b) =>
            new Date(a.messageTime) - new Date(b.messageTime)
        )
      }));

      // SORT CONVERSATIONS BY LATEST MESSAGE
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
  const sendTextMessage = async () => {
    const message = messageText.trim();

    if (!message) {
      setError("Please type a message first.");
      return;
    }

    if (!selectedChat?.partnerId) {
      setError("Please select a conversation first.");
      return;
    }

    try {
      setSendingMessage(true);
      setError("");
console.log("Selected Receiver ID:", selectedChat?.partnerId);
console.log("Selected Receiver Name:", selectedChat?.partnerName);
console.log("Sending Message:", message);
      const response = await fetch(`${API}/api/sendnotes/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": getToken()
        },
        body: JSON.stringify({
          receiverId: selectedChat.partnerId,
          message: message
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Message could not be sent.");
      }

      setMessageText("");
      await loadChats();

    } catch (err) {
      setError(err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  // Initial load and auto refresh
  useEffect(() => {
  loadChats();

  const interval = setInterval(() => {
    loadChats();
  }, 3000);

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
      const token = getToken();

      const [noteResponse, messageResponse] = await Promise.all([
        fetch(`${API}/api/sendnotes/read/${chat.partnerId}`, {
          method: "POST",
          headers: { "auth-token": token }
        }),

        fetch(`${API}/api/sendnotes/message/read/${chat.partnerId}`, {
          method: "POST",
          headers: { "auth-token": token }
        })
      ]);

      const [noteData, messageData] = await Promise.all([
        noteResponse.json(),
        messageResponse.json()
      ]);

      if (!noteResponse.ok || !noteData.success) {
        throw new Error(noteData.message || "Could not mark notes as read");
      }

      if (!messageResponse.ok || !messageData.success) {
        throw new Error(messageData.message || "Could not mark messages as read");
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
  if (!selectedChat) {
    previousMessageCount.current = 0;
    return;
  }

  const currentCount = selectedChat.messages.length;

  if (
    selectedId &&
    currentCount > previousMessageCount.current
  ) {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }

  previousMessageCount.current = currentCount;

}, [selectedId, selectedChat]);

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
  .chat-message-input {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.chat-message-input input {
  flex: 1;
  min-width: 0;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
}

.chat-message-input input:focus {
  border-color: #2563eb;
}

.chat-message-input button {
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.chat-message-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media(max-width: 480px) {
  .chat-message-input {
    min-width: 100%;
  }

  .chat-message-input button {
    padding: 12px;
  }
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
                      className={`unified-message ${outgoing ? "outgoing" : "incoming"
                        }`}
                    >
                      <div className={`unified-bubble ${outgoing ? "outgoing" : "incoming"
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
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap"
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

                <div className="chat-message-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendTextMessage();
                      }
                    }}
                    disabled={sendingMessage}
                  />

                  <button
                    onClick={sendTextMessage}
                    disabled={sendingMessage || !messageText.trim()}
                  >
                    {sendingMessage ? "Sending..." : "Send Message"}
                  </button>
                </div>
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
    </>
  );
}
