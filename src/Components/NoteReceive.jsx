
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./footer";

const API = "https://firest-backend.vercel.app";

export default function NoteReceive() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [error, setError] = useState("");
  

  const messagesEndRef = useRef(null);
  

  const getToken = () => localStorage.getItem("auth-token");

  const getSenderId = (sender) => {
    return typeof sender === "string" ? sender : sender?._id;
  };

  // Fetch received notes
  const loadReceived = async () => {
     const token = getToken();
      if (!token) {
    navigate("/", { replace: true });
    return;
  }
    try {
      const res = await fetch(`${API}/api/sendnotes/received`, {
        method: "GET",
        headers: {
          "auth-token": getToken()
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Internal server error. Please wait.");
        
      }

      setNotes(data.notes || []);
      setError("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load immediately and then every 1 minute
  useEffect(() => {
    loadReceived();

    const interval = setInterval(() => {
      loadReceived();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Mark sender's notes as read in MongoDB
  const handleSelectSender = async (senderId) => {
     if (!getToken()) {
    navigate("/", { replace: true });
    return;
  }
    setSelectedSenderId(senderId);

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
        throw new Error(data.message || "Internal server error. Please wait.");
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

  // Sort messages oldest to newest
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

  // Time for messages under 24 hours, date for older messages
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
if (loading) {
  return <Loading />;
}
    return messageDate.toLocaleDateString();
  };

  return (
    <>
    <div style={{
      display: "flex",
      height: "calc(100vh - 70px)",
      maxHeight: "800px",
      background: "#f0f2f5",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      fontFamily: "system-ui"
    }}>

      {/* LEFT SIDEBAR */}
      <div style={{
        width: "35%",
        minWidth: "280px",
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column"
      }}>

        <div style={{
          padding: "16px",
          background: "#f0f2f5",
          fontWeight: 700,
          fontSize: "18px",
          color: "#111b21",
          borderBottom: "1px solid #e5e7eb"
        }}>
          Received Notes
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <p style={{ padding: 16 }}>Loading...</p>
          ) : error ? (
            <p style={{ padding: 16, color: "red" }}>{error}</p>
          ) : senders.length === 0 ? (
            <p style={{ padding: 16, color: "#667781" }}>
              No notes received.
            </p>
          ) : (
            senders.map(s => {
              const unread = s.notes.filter(
                note => note.isRead !== true
              ).length;

              return (
                
                <div
                  key={s.senderId}
                  onClick={() => handleSelectSender(s.senderId)}
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    gap: "12px",
                    cursor: "pointer",
                    background: "#fff",
                    borderBottom: "1px solid #f5f6f6",
                    alignItems: "center"
                  }}
                >

                  <div style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {s.senderName?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
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
                      {s.notes[s.notes.length - 1]?.title} - {s.notes.length} notes
                    </small>
                  </div>

                  <small style={{
                    color: "#667781",
                    fontSize: "11px",
                    flexShrink: 0
                  }}>
                    {formatMessageTime(
                      s.notes[s.notes.length - 1]?.sentAt
                    )}
                  </small>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#efeae2"
      }}>

        {!selectedChat ? (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#667781"
          }}>
            Received Note Will Show Here 
          </div>
        ) : (
          <>

            {/* CHAT HEADER */}
            <div style={{
              padding: "12px 20px",
              background: "#f0f2f5",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderBottom: "1px solid #e5e7eb"
            }}>

              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700
              }}>
                {selectedChat.senderName?.[0]?.toUpperCase()}
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
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
              backgroundRepeat: "repeat",
              backgroundColor: "#efeae2"
            }}>

              {selectedChat.notes.map(n => (
                <div
                  key={n._id}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start"
                  }}
                >
                  <div style={{
                    maxWidth: "70%",
                    background: "#fff",
                    padding: "10px 14px",
                    borderRadius: "8px 8px 8px 0",
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                    position: "relative"
                  }}>

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
    <Footer/>
    </>
  );
}
