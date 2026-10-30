
import { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import NoteContext from "../Context/noteContext";
import Footer from "./footer";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useContext(NoteContext);

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showAlert("Warning", "Please request a reset code first.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      showAlert("Warning", "Please enter a valid 6-digit reset code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("Warning", "Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      showAlert("Warning", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://firest-backend.vercel.app/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            code,
            newPassword
          })
        }
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        showAlert("Warning", json.message || "Password reset failed.");
        return;
      }

      showAlert("Success", "Password reset successfully. Please log in.");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Reset password error:", error);
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
            .reset-welcome-panel {
              display: none !important;
            }

            .reset-form-panel {
              padding: 30px 22px !important;
            }

            .reset-main-title {
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
            className="reset-welcome-panel"
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
              Create New Password
            </h1>

            <p style={{ lineHeight: 1.8, color: "#edf0ff" }}>
              Set a new secure password and get back to organizing your
              notes.
            </p>

            <div style={{ fontSize: "70px", margin: "25px 0" }}>
              🔑 📒
            </div>

            <h3 style={{ fontWeight: "normal", fontStyle: "italic" }}>
              A Fresh Start for Your Notes
            </h3>
          </div>

          {/* Reset password form */}
          <div
            className="reset-form-panel"
            style={{
              flex: "1.2 1 320px",
              padding: "35px 30px",
              boxSizing: "border-box",
              minWidth: 0
            }}
          >
            <h2
              className="reset-main-title"
              style={{
                color: "#172344",
                fontSize: "36px",
                margin: "0 0 8px"
              }}
            >
              Reset Password
            </h2>

            <p
              style={{
                color: "#687795",
                lineHeight: 1.6,
                marginBottom: "25px",
                overflowWrap: "anywhere"
              }}
            >
              Enter the 6-digit code sent to{" "}
              <strong>{email || "your email"}</strong> and choose your new
              password.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "17px" }}>
                <label htmlFor="reset-code" style={labelStyle}>
                  6-Digit Reset Code
                </label>

                <input
                  id="reset-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="Enter reset code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "17px" }}>
                <label htmlFor="new-password" style={labelStyle}>
                  New Password
                </label>

                <input
                  id="new-password"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label htmlFor="confirm-password" style={labelStyle}>
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={inputStyle}
                />

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "#5368ed",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Show password
                </label>
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
                {loading ? "Resetting Password..." : "Reset Password →"}
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
              Didn't receive a code?{" "}
              <Link
                to="/forgot-password"
                style={{
                  color: "#5368ed",
                  fontWeight: "bold",
                  textDecoration: "none"
                }}
              >
                Request another
              </Link>
            </p>

            <p
              style={{
                textAlign: "center",
                color: "#687795",
                fontSize: "14px",
                marginBottom: 0
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

export default ResetPassword;
