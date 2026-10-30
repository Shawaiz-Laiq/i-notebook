
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoteContext from "../Context/noteContext";
import Footer from "./footer";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showAlert } = useContext(NoteContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(
        "https://firest-backend.vercel.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: cleanEmail })
        }
      );

      const json = await response.json();

      console.log("Forgot password response:", response.status, json);

      if (!response.ok) {
        showAlert(
          "Warning",
          json.message || "Unable to send reset code."
        );
        return;
      }

      showAlert("Success", json.message);

      navigate("/reset-password", {
        state: { email: cleanEmail }
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      showAlert("Warning", "Server se connection nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d4dced",
    borderRadius: "10px",
    fontSize: "15px",
    outlineColor: "#596bfa",
    background: "#fff"
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#263453"
  };

  return (
    <>
      <div
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "25px 15px",
          background: "#f4f6fc",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <style>{`
          @media (max-width: 600px) {
            .forgot-welcome-panel {
              display: none !important;
            }

            .forgot-form-panel {
              padding: 30px 22px !important;
            }

            .forgot-main-title {
              font-size: 31px !important;
            }
          }
        `}</style>

        <div
          style={{
            width: "100%",
            maxWidth: "950px",
            display: "flex",
            flexWrap: "wrap",
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 15px 50px rgba(35,52,110,0.14)"
          }}
        >
          {/* Purple welcome panel */}
          <div
            className="forgot-welcome-panel"
            style={{
              flex: "1 1 280px",
              background: "linear-gradient(145deg,#536dfe,#6555e8)",
              color: "white",
              padding: "40px 25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxSizing: "border-box"
            }}
          >
            <div style={{ fontSize: "55px", marginBottom: "15px" }}>
              🔐
            </div>

            <h1 style={{ fontSize: "30px", margin: "10px 0" }}>
              Forgot Password?
            </h1>

            <p style={{ lineHeight: 1.8, color: "#edf0ff" }}>
              Don't worry! We'll help you get back into your iNotebook
              account.
            </p>

            <div style={{ fontSize: "70px", margin: "25px 0" }}>
              ✉️ 🔑
            </div>

            <h3 style={{ fontWeight: "normal", fontStyle: "italic" }}>
              Your Notes Are Waiting
            </h3>
          </div>

          {/* Forgot password form */}
          <div
            className="forgot-form-panel"
            style={{
              flex: "1.2 1 320px",
              padding: "35px 30px",
              boxSizing: "border-box",
              minWidth: 0
            }}
          >
            <h2
              className="forgot-main-title"
              style={{
                color: "#172344",
                fontSize: "36px",
                margin: "0 0 8px"
              }}
            >
              Reset Your Password
            </h2>

            <p
              style={{
                color: "#687795",
                lineHeight: 1.6,
                marginBottom: "25px"
              }}
            >
              Enter your registered email address and we'll send you a
              password reset code.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="forgot-email" style={labelStyle}>
                  Email Address
                </label>

                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "none",
                  borderRadius: "10px",
                  background: "linear-gradient(100deg,#5267f5,#6574ff)",
                  color: "#fff",
                  fontSize: "17px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Sending Code..." : "Send Reset Code →"}
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                margin: "25px 0",
                color: "#687795"
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: "1px",
                  background: "#dce2ef"
                }}
              />
              Or
              <span
                style={{
                  flex: 1,
                  height: "1px",
                  background: "#dce2ef"
                }}
              />
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#687795",
                fontSize: "14px"
              }}
            >
              Remember your password?{" "}
              <Link
                to="/"
                style={{
                  color: "#5368ed",
                  fontWeight: "bold",
                  textDecoration: "none"
                }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ForgotPassword;
