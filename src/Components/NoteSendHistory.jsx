
import { useCallback ,useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const API = "https://firest-backend.vercel.app";

export default function NoteSendHistory() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
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
            throw new Error(data.message || "Internal server error. Please wait.");
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
  },  [loadSent]);

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

  if (loading) {
    return <Loading />;
  }

  return (
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
          Sent Notes
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>

          {error ? (
            <p style={{ padding: 16, color: "red" }}>
              {error}
            </p>
          ) : receivers.length === 0 ? (
            <p style={{ padding: 16, color: "#667781" }}>
              No notes received.
            </p>
          ) : (
            receivers.map(receiver => {
              const lastNote =
                receiver.notes[receiver.notes.length - 1];

              return (
                <div
                  key={receiver.receiverId}
                  onClick={() =>
                    setSelectedReceiverId(receiver.receiverId)
                  }
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    gap: "12px",
                    cursor: "pointer",
                    background:
                      selectedReceiverId === receiver.receiverId
                        ? "#e9edef"
                        : "#fff",
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
                    {receiver.receiverName?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
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
            your Chat whill Show Here
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
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundImage:
                "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
              backgroundRepeat: "repeat",
              backgroundColor: "#efeae2"
            }}>

              {selectedChat.notes.map(note => (
                <div
                  key={note._id}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end"
                  }}
                >

                  <div style={{
                    maxWidth: "70%",
                    background: "#d9fdd3",
                    padding: "10px 14px",
                    borderRadius: "8px 8px 0 8px",
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)"
                  }}>

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
  );
}
