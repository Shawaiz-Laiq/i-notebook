
import { useEffect, useState } from "react";

const API = "https://firest-backend.vercel.app";

export default function SendNote({ note, onClose }) {
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendingId, setSendingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("auth-token");

  useEffect(() => {
    if (!friendsOpen || friends.length > 0) return;

    const loadFriends = async () => {
      setFriendsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API}/api/sendnotes/friends`,
          {
            headers: {
              "auth-token": getToken()
            }
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Friends list load nahi hui.");
        }

        setFriends(result.friends || []);
      } catch (err) {
        setError(err.message || "Friends list load nahi hui.");
      } finally {
        setFriendsLoading(false);
      }
    };

    loadFriends();
  }, [friendsOpen, friends.length]);

  const sendToUser = async (user) => {
    setError("");
    setSuccess("");

    if (!note?._id) {
      setError("Note ki unique ID nahi mili.");
      return;
    }

    if (!user?._id) {
      setError("User ki unique ID nahi mili.");
      return;
    }

    setSendingId(user._id);

    try {
      const response = await fetch(
  `${API}/api/sendnotes/send/${note._id}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": getToken()
    },
    body: JSON.stringify({
      recipientId: user._id
    })
  }
);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Note send nahi hua.");
      }

      setSuccess(
        `Note ${user.name || user.username || user.email || "user"} ko send ho gaya.`
      );
      setQuery("");
    } catch (err) {
      setError(err.message || "Note send nahi hua.");
    } finally {
      setSendingId("");
    }
  };

 const findUser = async (event) => {
  event.preventDefault();
  setError("");
  setSuccess("");

  if (!query.trim()) {
    setError("User ID ya username enter karo.");
    return;
  }

  setSearchLoading(true);

  try {
    const response = await fetch(
      `${API}/api/auth/find-user?query=${encodeURIComponent(query.trim())}`,
      {
        headers: {
          "auth-token": getToken() 
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.user?._id) {
      throw new Error(result.message || "Is ID ya username ka user nahi mila.");
    }

    await sendToUser(result.user);
  } catch (err) {
    setError(err.message || "User search nahi ho saki.");
  } finally {
    setSearchLoading(false);
  }
};

  return (
    
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        boxSizing: "border-box"
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "clamp(18px, 4vw, 28px)",
          borderRadius: "20px",
          background: "linear-gradient(145deg, #ffffff, #f5f3ff)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.25)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          <div>
            <p style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#7c3aed",
              margin: "0 0 6px"
            }}>
              SHARE WITH A USER
            </p>
            <h2 style={{ margin: 0, color: "#1e1b4b" }}>
              Send Note ✉
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              borderRadius: "10px",
              background: "#ede9fe",
              color: "#6d28d9",
              fontSize: "24px",
              cursor: "pointer"
            }}
          >
            &times;
          </button>
        </div>

        <div style={{
          padding: "16px",
          marginBottom: "20px",
          borderRadius: "12px",
          background: "#fff",
          border: "1px solid #e9e5f5"
        }}>
          <h3 style={{
            margin: "0 0 8px",
            color: "#1e1b4b",
            overflowWrap: "anywhere"
          }}>
            {note?.title || "Untitled note"}
          </h3>

          <p style={{
            margin: 0,
            color: "#4b5563",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere"
          }}>
            {note?.description || "No description"}
          </p>
        </div>

        <form onSubmit={findUser}>
          <label
            htmlFor="recipient"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#374151"
            }}
          >
            Enter unique ID or username
          </label>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px"
          }}>
            <input
              id="recipient"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="User ID or username"
              style={{
                flex: "1 1 180px",
                minWidth: 0,
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                boxSizing: "border-box"
              }}
            />

            <button
              type="submit"
              disabled={searchLoading || Boolean(sendingId)}
              style={{
                padding: "11px 15px",
                border: "none",
                borderRadius: "10px",
                background: "#7c3aed",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              {searchLoading ? "Searching..." : "Find & Send"}
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            style={{
              marginTop: "12px",
              padding: "10px",
              borderRadius: "10px",
              background: "#fee2e2",
              color: "#b91c1c",
              overflowWrap: "anywhere"
            }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            style={{
              marginTop: "12px",
              padding: "10px",
              borderRadius: "10px",
              background: "#dcfce7",
              color: "#166534",
              overflowWrap: "anywhere"
            }}
          >
            {success}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={() => {
              setFriendsOpen((open) => !open);
              setError("");
            }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              border: "1px solid #ddd6fe",
              borderRadius: "10px",
              background: "#ede9fe",
              color: "#5b21b6",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <span>Friends — previous recipients</span>
            <span>{friendsOpen ? "▲" : "▼"}</span>
          </button>

          {friendsOpen && (
            <div style={{
              marginTop: "10px",
              padding: "8px",
              border: "1px solid #e9e5f5",
              borderRadius: "12px",
              background: "#fff"
            }}>
              {friendsLoading ? (
                <p>Loading friends...</p>
              ) : friends.length === 0 ? (
                <p style={{ color: "#6b7280" }}>
                  No previous recipients found.
                </p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                      padding: "10px 4px",
                      borderBottom: "1px solid #f3f4f6"
                    }}
                  >
                    <div style={{ minWidth: 0, flex: "1 1 150px" }}>
                      <p style={{
                        margin: 0,
                        fontWeight: 600,
                        color: "#1f2937",
                        overflowWrap: "anywhere"
                      }}>
                        {friend.name || friend.username || "Unnamed user"}
                      </p>
                      <small style={{
                        color: "#6b7280",
                        overflowWrap: "anywhere"
                      }}>
                        {friend.email || friend.username || friend._id}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() => sendToUser(friend)}
                      disabled={Boolean(sendingId)}
                      style={{
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#7c3aed",
                        color: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      {sendingId === friend._id ? "Sending..." : "Send"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "22px"
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "11px 22px",
              border: "none",
              borderRadius: "10px",
              background: "#e5e7eb",
              color: "#374151",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
