
import { useEffect, useState } from "react";

const API = "https://firest-backend.vercel.app";

export default function ChatSendNote({ recipientId, recipientName, onClose, onSent }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = () => localStorage.getItem("auth-token");

  // Load user's own notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await fetch(`${API}/api/notes/fetchnotes`, {
          headers: {
            "auth-token": token()
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Notes load nahi huay.");
        }

        setNotes(Array.isArray(result) ? result : result.notes || []);
      } catch (err) {
        setError(err.message || "Notes load nahi huay.");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Send selected note to currently opened chat user
  const sendNote = async (note) => {
    if (!recipientId || !note?._id) {
      setError("Recipient ya note ID missing hai.");
      return;
    }

    setSendingId(note._id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API}/api/sendnotes/send/${note._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token()
          },
          body: JSON.stringify({
            recipientId
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Note send nahi hua.");
      }

      setSuccess("Note successfully sent!");

      if (onSent) onSent();

    } catch (err) {
      setError(err.message || "Note send nahi hua.");
    } finally {
      setSendingId("");
    }
  };

  const filteredNotes = notes.filter(note =>
    `${note.title || ""} ${note.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  
return (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background: "rgba(15, 23, 42, 0.48)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 520,
        maxHeight: "88vh",
        overflowY: "auto",
        padding: "clamp(18px, 4vw, 28px)",
        borderRadius: 22,
        boxSizing: "border-box",
        background: "linear-gradient(145deg, #ffffff, #fdf2f8, #f5f3ff)",
        boxShadow: "0 25px 80px rgba(76, 29, 149, 0.25)",
        border: "1px solid rgba(255,255,255,.8)"
      }}
    >
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 22
      }}>
        <div>
          <div style={{
            display: "inline-block",
            padding: "5px 11px",
            borderRadius: 20,
            background: "#fce7f3",
            color: "#be185d",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1
          }}>
            SHARE YOUR KNOWLEDGE
          </div>

          <h2 style={{
            margin: "10px 0 4px",
            fontSize: 25,
            fontWeight: 800,
            background: "linear-gradient(90deg, #7c3aed, #db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Send a Note ✨
          </h2>

          <p style={{
            margin: 0,
            color: "#64748b",
            fontSize: 13
          }}>
            Share your saved notes with {recipientName || "your friend"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            border: "none",
            borderRadius: 12,
            background: "#fce7f3",
            color: "#be185d",
            fontSize: 24,
            cursor: "pointer"
          }}
        >
          ×
        </button>
      </div>

      {/* SEARCH */}
      <div style={{
        position: "relative",
        marginBottom: 20
      }}>
        <span style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 18
        }}>
          🔎
        </span>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your saved notes..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 14px 14px 43px",
            border: "1px solid #e9d5ff",
            borderRadius: 13,
            outline: "none",
            background: "#fff",
            color: "#1e1b4b",
            fontSize: 14,
            boxShadow: "0 4px 12px rgba(124,58,237,.06)"
          }}
        />
      </div>

      {/* STATUS */}
      {error && (
        <div style={{
          padding: 12,
          marginBottom: 14,
          borderRadius: 11,
          background: "#fee2e2",
          color: "#b91c1c",
          fontSize: 13
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: 12,
          marginBottom: 14,
          borderRadius: 11,
          background: "#dcfce7",
          color: "#166534",
          fontSize: 13,
          fontWeight: 600
        }}>
          ✓ {success}
        </div>
      )}

      {/* NOTES HEADING */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 13
      }}>
        <h3 style={{
          margin: 0,
          color: "#312e81",
          fontSize: 16
        }}>
          Your Saved Notes
        </h3>

        <span style={{
          background: "#ede9fe",
          color: "#6d28d9",
          padding: "5px 10px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 700
        }}>
          {filteredNotes.length} Notes
        </span>
      </div>

      {/* NOTES LIST */}
      {loading ? (
        <div style={{
          padding: 35,
          textAlign: "center",
          color: "#7c3aed"
        }}>
          <div style={{ fontSize: 30 }}>✦</div>
          Loading your notes...
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={{
          padding: 30,
          textAlign: "center",
          background: "#fff",
          borderRadius: 15,
          border: "1px dashed #d8b4fe",
          color: "#64748b"
        }}>
          <div style={{ fontSize: 35 }}>📝</div>
          <p style={{ marginBottom: 0 }}>
            No notes found. Try another search.
          </p>
        </div>
      ) : (
        filteredNotes.map((note, index) => (
          <div
            key={note._id}
            style={{
              padding: 15,
              marginBottom: 12,
              borderRadius: 15,
              background: "#fff",
              border: "1px solid #f0d9f7",
              boxShadow: "0 5px 16px rgba(124,58,237,.07)",
              transition: "all .2s ease"
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            }}>
              <div style={{
                width: 42,
                height: 42,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                background: index % 2 === 0
                  ? "linear-gradient(135deg,#ede9fe,#fce7f3)"
                  : "linear-gradient(135deg,#fce7f3,#dbeafe)",
                fontSize: 21
              }}>
                📄
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  margin: "2px 0 7px",
                  color: "#312e81",
                  fontSize: 15,
                  overflowWrap: "anywhere"
                }}>
                  {note.title || "Untitled Note"}
                </h4>

                <p style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {note.description || "No description"}
                </p>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 14
            }}>
              <button
                type="button"
                onClick={() => sendNote(note)}
                disabled={Boolean(sendingId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minWidth: 125,
                  padding: "10px 17px",
                  border: "none",
                  borderRadius: 10,
                  background: sendingId === note._id
                    ? "#a78bfa"
                    : "linear-gradient(100deg,#7c3aed,#db2777)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: sendingId ? "not-allowed" : "pointer",
                  boxShadow: "0 5px 13px rgba(219,39,119,.22)",
                  opacity: sendingId && sendingId !== note._id ? 0.6 : 1
                }}
              >
                {sendingId === note._id ? (
                  "Sending..."
                ) : (
                  <>Send Note <span>➤</span></>
                )}
              </button>
            </div>
          </div>
        ))
      )}

      {/* FOOTER */}
      <button
        type="button"
        onClick={onClose}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 12,
          border: "1px solid #e9d5ff",
          borderRadius: 11,
          background: "#fff",
          color: "#7c3aed",
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        Close
      </button>
    </div>
  </div>
);

}
