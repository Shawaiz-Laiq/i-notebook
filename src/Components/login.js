// import { useState } from "react";
// //import { useNavigate} from 'react-router'

// function Login() {
//     const [cerden, setcerden] = useState({email: "" , password: ""})
//     //let history =  useNavigate()
//     const handleSumbit = async (e) => {
       
//         e.preventDefault();
//         const response = await fetch('http://localhost:5000/api/auth/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFkNjI4MWY1NDg0NjZhNjI3OGIzNDM4In0sImlhdCI6MTc5MjQxOTg3MX0.tzZlft0jgbQWjvHspgMdJdKzBmVuLLUMSgDUjHTKgyQ'
//             },
//              body: JSON.stringify({email :cerden.email, password: cerden.password})
//         });
//         const json = await response.json();
//         //console.log(json. jwtdata)
//         if (json.success){
//          localStorage.setItem('token' , json.jwtdata)
//             //history.push('/');
//         } else {
//             alert("Worng information may be email or passowrd")
//         }
       
//     }

//     const onChange =(e) => {
//         setcerden({...cerden ,[e.target.name] : e.target.value})

//     }



//     return (
 
//             <form  onSubmit={handleSumbit}>
//             <div className="form-group">
//                 <label htmlFor="email">Email address</label>
//                 <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" required value={cerden.email} onChange={onChange} />
//                 <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
//             </div>
//             <div className="form-group">
//                 <label htmlFor="Password">Password</label>
//                 <input type="password" className="form-control" id="Password" name="password" required  value={cerden.password}onChange={onChange}/>
//             </div>
//             <div className="form-group form-check">
//                 <input type="checkbox" className="form-check-input"  id="exampleCheck1" />
//                 <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
//             </div>
//             <button type="submit" className="btn btn-primary">Submit</button>
//         </form>

//     )
// }

// export default Login;






import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoteContext from "../Context/noteContext";

function Login() {
  const [cerden, setcerden] = useState({
    email: "",
    password: ""
  });

  const [Invalid, setInvalid] = useState(false)
  const [forget, setforget] = useState(false)

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showAlert } = useContext(NoteContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setcerden({
      ...cerden,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email :cerden.email, password: cerden.password})
        }
      );

      const json = await response.json();
            console.log(Invalid)

      if (!response.ok) {
        showAlert("Warning", json.error || "Login failed");
        setInvalid(true)
        return;
      }

      const token = json.jwpdata;
      navigate("/home");

      if (!token) {
        showAlert("Warning", "Worng data");
        setInvalid(true)
        return;
      }

      localStorage.setItem("token", token);
      showAlert("Success", "Login successful!");
      setInvalid(false)
      

    } catch (error) {
      showAlert("Warning", "Server se connection nahi ho raha");
      setInvalid(true)
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #d4dced",
    borderRadius: "10px",
    fontSize: "15px",
    outlineColor: "#596bfa",
    background: "#fff"
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "9px",
    color: "#263453"
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px 15px",
        //background: "#f4f6fc",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Responsive CSS isi file mein hai */}
      <style>{`
        @media (max-width: 600px) {
          .login-welcome-panel {
            display: none !important;
          }

          .login-form-panel {
            padding: 32px 22px !important;
          }

          .login-main-title {
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
        {/* Purple panel: desktop par visible, mobile par hidden */}
        <div
          className="login-welcome-panel"
          style={{
            flex: "1 1 280px",
            background: "linear-gradient(145deg,#536dfe,#6555e8)",
            color: "white",
            padding: "45px 25px",
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
            Welcome Back!
          </h1>

          <p style={{ lineHeight: 1.8, color: "#edf0ff" }}>
            Log in to your account and keep your notes safe.
          </p>

          <div style={{ fontSize: "75px", margin: "25px 0" }}>
            📋 ☕
          </div>

          <h3 style={{ fontWeight: "normal", fontStyle: "italic" }}>
            Better Notes, Better You
          </h3>
        </div>

        {/* Login form */}
        <div
          className="login-form-panel"
          style={{
            flex: "1.2 1 320px",
            padding: "25px 40px",
            boxSizing: "border-box",
            minWidth: 0
          }}
        >
          <h2
            className="login-main-title"
            style={{
              color: "#172344",
              fontSize: "36px",
              margin: "0 0 10px"
            }}
          >
            Login
          </h2>

          <p style={{ color: "#687795", lineHeight: 1.7, marginBottom: "30px" }}>
            Enter your email and password to access your account.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "22px" }}>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={cerden.email}
                onChange={onChange}
                autoComplete="email"
                required
                style={inputStyle}
              />
              {Invalid === true && <span style={{
                fontSize: ".7rem",
                color:"red"
                }}>Invaild Email or Password</span>}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={cerden.password}
                  onChange={onChange}
                  autoComplete="current-password"
                  required
                  style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    padding: "0 10px",
                    border: "1px solid #d4dced",
                    borderRadius: "10px",
                    background: "#fff",
                    color: "#5368ed",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                margin: "20px 0 25px",
                fontSize: "14px"
              }}
            >
              <label style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                <input type="checkbox" />
                Remember me
              </label>

              <span style={{ color: "#5368ed", cursor: "pointer" }} 
              onClick={()=>{  forget === false? setforget(true) :setforget(false) }}>
                Forgot password?
              </span>
              
            </div>
            {forget === true &&<span style={{fontSize: ".8rem"}}>To change your password, please contact us at Shawaizlaiq20@gmail.com</span>}

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
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              margin: "28px 0",
              color: "#687795"
            }}
          >
            <span style={{ flex: 1, height: "1px", background: "#dce2ef" }} />
            Or
            <span style={{ flex: 1, height: "1px", background: "#dce2ef" }} />
          </div>

          <p style={{ textAlign: "center", color: "#687795", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#5368ed",
                fontWeight: "bold",
                textDecoration: "none"
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
