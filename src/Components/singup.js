
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoteContext from "../Context/noteContext";

function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newpass, setnewpass] = useState('');
  const [confpass, setconfpass] = useState('');
  const [Invalid, setInvalid] = useState(false)
  const [InvalName, setInvalName] = useState(false)
  const [InvalAccount, setInvalAccount] = useState(false)

  const { showAlert } = useContext(NoteContext);
  const navigate = useNavigate();

  const onChangenew =(e) => {
   const value = e.target.value;
   setnewpass(value);
   setInvalid(confpass !== value);
  }
  const onChangecon =(e) => {
   const value = e.target.value;
   setconfpass(value);
   setInvalid(newpass !== value);
  }

  const onChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      showAlert("Warning", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password
          })
        }
      );

      const json = await response.json();
      if(json.errors === 'acoount already exists' )  {
        setInvalAccount(true)
        setInvalName(false)
      }
      if (json.errors === 'This name is already taken') {
        setInvalName(true)
        setInvalAccount(false)
      } 
      if (json.errors === 'acoount already exists , This name is already taken') {
        setInvalName(true)
        setInvalAccount(true)
      }
      console.log(json)

      if (!response.ok) {
        showAlert("Warning", json.error || "Signup failed");
        return;
      }

      const token = json.authtoken || json.jwtdata;

      if (token) {
        localStorage.setItem("token", json.jwtdata);
      }

      showAlert("Success", "Account created successfully!");
      navigate(json.jwtdata ? "/home" : "/");
    } catch (error) {
      showAlert("Warning", "Server se connection nahi ho raha");
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
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px 15px",
        background: "#f4f6fc",
        fontFamily: "Arial, sans-serif"
      }}>
      <style>{`
        @media (max-width: 600px) {
          .signup-welcome-panel {
            display: none !important;
          }

          .signup-form-panel {
            padding: 30px 22px !important;
          }

          .signup-main-title {
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
        {/* Purple panel: desktop only */}
        <div
          className="signup-welcome-panel"
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
            📝
          </div>

          <h1 style={{ fontSize: "30px", margin: "10px 0" }}>
            Join Us Today!
          </h1>

          <p style={{ lineHeight: 1.8, color: "#edf0ff" }}>
            Create your account and keep all your notes organized in one place.
          </p>

          <div style={{ fontSize: "75px", margin: "25px 0" }}>
            ✨ 📒
          </div>

          <h3 style={{ fontWeight: "normal", fontStyle: "italic" }}>
            Your Ideas, Your Space
          </h3>
        </div>

        {/* Signup form */}
        <div
          className="signup-form-panel"
          style={{
            flex: "1.2 1 320px",
            padding: "35px 30px",
            boxSizing: "border-box",
            minWidth: 0
          }}
        >
          <h2
            className="signup-main-title"
            style={{
              color: "#172344",
              fontSize: "36px",
              margin: "0 0 8px"
            }}
          >
            Create Account
          </h2>

          <p style={{ color: "#687795", lineHeight: 1.6, marginBottom: "25px" }}>
            Enter your details to get started.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "17px" }}>
              <label htmlFor="signup-name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={credentials.name}
                onChange={onChange}
                autoComplete="name"
                required
                minLength={2}
                style={inputStyle}
              />
               {InvalName === true && <span style={{
                fontSize: ".7rem",
                color:"red"
                }}>This name is already taken</span>}
              
            </div>

            <div style={{ marginBottom: "17px" }}>
              <label htmlFor="signup-email" style={labelStyle}>
                Email Address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={onChange}
                autoComplete="email"
                required
                style={inputStyle}
              />
              {InvalAccount === true && <span style={{
                fontSize: ".7rem",
                color:"red"
                }}>Account already exists</span>}
            </div>

            <div style={{ marginBottom: "17px" }}>
              <label htmlFor="signup-password" style={labelStyle}>
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={credentials.password}
                onChange={(e) => {onChange(e); onChangenew(e)}}
                autoComplete="new-password"
                required
                minLength={5}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="signup-confirm" style={labelStyle}>
                Confirm Password
              </label>
              <input
                id="signup-confirm"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password again"
                value={credentials.confirmPassword}
                onChange={(e) => {onChange(e); onChangecon(e)}}
                autoComplete="new-password"
                required
                minLength={5}
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
              >{Invalid === true && <span style={{
                fontSize: ".7rem",
                color:"red"
                }}>Passwords do not match</span>}
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
              {loading ? "Creating Account..." : "Create Account →"}
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
            <span style={{ flex: 1, height: "1px", background: "#dce2ef" }} />
            Or
            <span style={{ flex: 1, height: "1px", background: "#dce2ef" }} />
          </div>

          <p style={{ textAlign: "center", color: "#687795", fontSize: "14px" }}>
            Already have an account?{" "}
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
  );
}

export default Signup;
