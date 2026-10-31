
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://firest-backend.vercel.app/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email.trim(),
            verficationCode: code.trim()
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setError(false);
        setMessage("Email verified successfully! Please log in.");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setError(true);
        setMessage(data.message || "Verification failed.");
      }
    } catch (err) {
      setError(true);
      setMessage("Server se connection nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "430px",
        padding: "35px",
        borderRadius: "18px",
        background: "#fff",
        boxShadow: "0 12px 40px rgba(35,52,110,0.12)"
      }}>
        <div style={{ textAlign: "center", fontSize: "45px" }}>
          📧
        </div>

        <h2 style={{
          textAlign: "center",
          color: "#172344"
        }}>
          Verify Your Email
        </h2>

        <p style={{
          textAlign: "center",
          color: "#687795",
          lineHeight: 1.6
        }}>
          Enter the 6-digit verification code sent to your email address.
        </p>

        <label htmlFor="verify-email">Email address</label>

        <input
          id="verify-email"
          type="email"
          value={email}
          readOnly
          autoComplete="email"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px",
            margin: "10px 0 20px",
            border: "1px solid #d4dced",
            borderRadius: "9px",
            backgroundColor: "#f1f3f5",
            color: "#555",
            cursor: "not-allowed"
          }}
        />

        <label htmlFor="verification-code">Verification code</label>
        <input
          id="verification-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          required
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px",
            margin: "10px 0 20px",
            border: "1px solid #d4dced",
            borderRadius: "9px",
            fontSize: "20px",
            letterSpacing: "6px",
            textAlign: "center"
          }}
        />

        {message && (
          <p role="status" style={{
            color: error ? "#dc2626" : "#15803d",
            fontSize: "14px",
            lineHeight: 1.5
          }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "9px",
            background: "#596bfa",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading || code.length !== 6 ? 0.7 : 1
          }}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <p style={{ textAlign: "center", marginTop: "22px" }}>
          <Link to="/login" style={{
            color: "#5368ed",
            textDecoration: "none"
          }}>
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default VerifyEmail;
