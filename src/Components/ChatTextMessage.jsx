
import { useState } from "react";

const API = "https://firest-backend.vercel.app";

export default function ChatTextMessage({
    recipientId,
    onClose,
    onSent
}) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setError("Please write a message.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("auth-token");

            const response = await fetch(`${API}/api/sendnotes/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({
                     receiverId: recipientId,
                    message
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Message could not be sent");
            }

            setMessage("");

            if (onSent) {
                await onSent();
            }

            onClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 15
        }}>
            <form
                onSubmit={sendMessage}
                style={{
                    width: "100%",
                    maxWidth: 450,
                    background: "white",
                    padding: 22,
                    borderRadius: 14
                }}
            >
                <h3 style={{ marginTop: 0 }}>
                    Send Message 💬
                </h3>

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    maxLength={5000}
                    rows={6}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 9,
                        resize: "vertical",
                        fontSize: 15
                    }}
                />

                <small>
                    {message.length}/5000 characters
                </small>

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 15
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: 8,
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </div>
            </form>
        </div>
    );
}
