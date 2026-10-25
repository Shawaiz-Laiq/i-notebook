import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./footer";



function Account() {
    const navigate = useNavigate();
    const [id, setid] = useState('')
    const [name, setname] = useState('')
    const [emaila, setemaila] = useState('')
    const [date, setdate] = useState('')
    const token = localStorage.getItem("token");
    const [check, setcheck] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (name !== null && name !== undefined && name.trim() !== "") {
                setcheck(true)
            } else {
                navigate("/", { replace: true })
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [name]);

    const handleSubmit = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/getuser",
                {
                    method: "POST",
                    headers: {
                        "auth-token": token
                    }
                }
            );

            const json = await response.json();

            setname(json.name ?? "");
            setemaila(json.email ?? "");
            setdate(json.time ?? "");
            setid(json._id ?? "");

        } catch (error) {
            console.error("Something went wrong:", error.message);
        }
    };
    handleSubmit()
    function formatMyDate(isoString) {
  const dateObj = new Date(isoString);

  
  const date = dateObj.toLocaleDateString('en-CA'); 

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0'); 

  hours = hours % 12;
  hours = hours ? hours : 12; 

  return `${date} At ${hours}:${minutes}`;
}
const incomingData = date
    
    return (
    <>
        {check === false ? <Loading /> : <div style={{
            minHeight: "100vh",
            padding: "35px 16px",
            background: "linear-gradient(135deg, #f5edff, #eef2ff)",
            color: "#20164b"
        }}>
            <div style={{
                maxWidth: "1000px",
                margin: "auto",
                background: "white",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "0 15px 50px #4c1d9515"
            }}>
                <h2 style={{ marginTop: 0 }}>👑 My Account</h2>
                <p style={{ color: "#777" }}>
                    Manage your personal account details
                </p>

                <div style={{
                    margin: "25px 0",
                    padding: "30px",
                    borderRadius: "20px",
                    color: "white",
                    background: "linear-gradient(120deg, #7c3aed, #24105c)"
                }}>
                    <div style={{ fontSize: "42px" }}>👤</div>
                    <h1 style={{ marginBottom: "15px" }}>{name}</h1>
                    <span style={{
                        background: "#facc15",
                        color: "#40220a",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                    }}>
                        👑 VIP MEMBER
                    </span>
                    <p style={{ marginTop: "15px" }}>Welcome to your personal space!</p>
                </div>

                <h3>Account Details</h3>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "18px"
                }}>
                    <div style={cardStyle}>
                        <label>Username</label>
                        <h3 style={{ fontSize: "20px" }}>{name}</h3>
                        <button style={buttonStyle}>
                            ✏️ Edit Username
                        </button>
                    </div>

                    <div style={cardStyle}>
                        <label>Email Address</label>
                        <h3 style={{ fontSize: "20px" }}> {emaila}</h3>
                        <small>🔒 Email cannot be edited here</small>
                    </div>

                    <div style={cardStyle}>
                        <label>UID (Permanent)</label>
                        <h3 style={{ overflowWrap: "anywhere", fontSize: "20px" }}>{id}</h3>
                        <small>🔒 Unique ID — not editable</small>
                    </div>

                    <div style={cardStyle}>
                        <label>Date of Joining</label>
                        <h3 style={{ fontSize: "20px" }}>{formatMyDate(incomingData)}</h3>
                        <small>📅 Member since joining</small>
                    </div>
                </div>

                <div style={{
                    marginTop: "25px",
                    padding: "20px",
                    borderRadius: "16px",
                    background: "#f5f0ff",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "30px" }}>👑</div>
                    <h3 style={{ margin: "8px" }}>VIP Status</h3>
                    <p style={{ marginBottom: 0 }}>
                        Your premium account experience
                    </p>
                </div>
                <div
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/";}}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "25px",
                padding: "14px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(239,68,68,0.25)",
                transition: "0.3s" }}>
                Logout
            </div>
            </div>
           
        
        </div>}
        <Footer/>
    </>
    );
}

const cardStyle = {
    padding: "22px",
    border: "1px solid #e5dcff",
    borderRadius: "16px",
    background: "#fff",
    overflowWrap: "anywhere",
};

const buttonStyle = {
    padding: "9px 14px",
    margin: "5px 5px 0 0",
    border: "none",
    borderRadius: "8px",
    background: "#6d28d9",
    color: "white",
    cursor: "pointer"
};




export default Account;
