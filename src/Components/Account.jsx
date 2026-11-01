import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./footer";



function Account() {
    const navigate = useNavigate();
    const [id, setid] = useState('')
    const [name, setname] = useState('')
    const [emaila, setemaila] = useState('')
    const [date, setdate] = useState('')
    const [check, setcheck] = useState(false)
    const [showEditName, setShowEditName] = useState(false);
const [newName, setNewName] = useState("");
const [nameLoading, setNameLoading] = useState(false);
const [nameMessage, setNameMessage] = useState("");
const [suggestions, setSuggestions] = useState([]);

    const [accountLoading, setAccountLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("auth-token");

            if (!token) {
                setAccountLoading(false);
                navigate("/", { replace: true });
                return;
            }

            try {
                const response = await fetch(
                    "https://firest-backend.vercel.app/api/auth/getuser",
                    {
                        method: "POST",
                        headers: {
                            "auth-token": token
                        }
                    }
                );

                const json = await response.json();

                if (!response.ok) {
                    localStorage.removeItem("auth-token");
                    navigate("/", { replace: true });
                    return;
                }

                setname(json.name ?? "");
                setemaila(json.email ?? "");
                setdate(json.time ?? "");
                setid(json._id ?? "");
                setcheck(true);

            } catch (error) {
                console.error("Account fetch error:", error);
            } finally {
                setAccountLoading(false);
            }
        };

        fetchAccount();
    }, [navigate]);

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
    
const saveUsername = async () => {
    // Spaces ko underscore mein convert karo
    const trimmedName = newName.trim().replace(/\s+/g, "_");

    if (trimmedName.length < 3 || trimmedName.length > 12) {
        setNameMessage("Username must be between 3 and 12 characters.");
        return;
    }

    try {
        setNameLoading(true);
        setNameMessage("");
        setSuggestions([]);

        const token = localStorage.getItem("auth-token");

        const response = await fetch(
            "https://firest-backend.vercel.app/api/auth/update-name",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({ name: trimmedName })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setNameMessage(
                data.message || data.errors || "Username update failed."
            );
            setSuggestions(data.suggestions || []);
            return;
        }

        setname(data.name);
        setNewName(data.name);
        setNameMessage("Username updated successfully!");
        setSuggestions([]);

        setTimeout(() => {
            setShowEditName(false);
            setNameMessage("");
        }, 1200);

    } catch (error) {
        console.error("Username update error:", error);
        setNameMessage("Something went wrong. Please try again.");
    } finally {
        setNameLoading(false);
    }
};


    return (
        <>
            {accountLoading || !check ? (<Loading />) : (<div style={{
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
                            <button
    style={buttonStyle}
    onClick={() => {
        setNewName(name);
        setNameMessage("");
        setSuggestions([]);
        setShowEditName(true);
    }}
>
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
                        <div style={cardStyle}>
                            <label >See Your Sent Notes</label>
                          <h3>
                            <Link to="/sentnotes">Click Here to See</Link></h3>
                        </div>
                        <div style={cardStyle}>
                            <label >See Your Received Notes</label>
                          <h3>
                            <Link to="/received">Click Here to See</Link></h3>
                        </div>
                    </div>

                    <div style={{
                        marginTop: "25px",
                        padding: "20px",
                        borderRadius: "16px",
                        background: "#f5f0ff",
                        textAlign: "center"
                    }}>
                        {showEditName && (
    <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20, 10, 40, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "15px"
    }}>
        <div style={{
            width: "100%",
            maxWidth: "430px",
            background: "white",
            padding: "25px",
            borderRadius: "20px",
            boxShadow: "0 15px 50px #0003"
        }}>
            <h2 style={{ color: "#6d28d9", marginTop: 0 }}>
                ✏️ Change Username
            </h2>

            <p style={{ color: "#777" }}>
                Enter your new username. It must be unique.
            </p>

            
<input
    type="text"
    value={newName}
    onChange={(e) => {
        const value = e.target.value
            .replace(/\s+/g, "_")
            .slice(0, 12);

        setNewName(value);
        setNameMessage("");
        setSuggestions([]);
    }}
    maxLength={12}
    placeholder="Enter new username"
    style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        border: "1px solid #c4b5fd",
        borderRadius: "10px",
        fontSize: "16px",
        outline: "none"
    }}
/>


            <small style={{ color: "#777" }}>
    Minimum 3 and maximum 12 characters. Spaces are replaced with _.
    ({newName.length}/12)
</small>

            {nameMessage && (
                <p style={{
                    color: nameMessage.includes("successfully")
                        ? "green"
                        : "red",
                    marginTop: "12px"
                }}>
                    {nameMessage}
                </p>
            )}

            {suggestions.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                    <strong style={{ color: "#6d28d9" }}>
                        Available username suggestions:
                    </strong>

                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "10px"
                    }}>
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => {
                                    setNewName(suggestion);
                                    setNameMessage("");
                                    setSuggestions([]);
                                }}
                                style={{
                                    padding: "8px 12px",
                                    border: "1px solid #c4b5fd",
                                    borderRadius: "8px",
                                    background: "#f5f0ff",
                                    color: "#6d28d9",
                                    cursor: "pointer"
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "22px"
            }}>
                <button
                    onClick={saveUsername}
                    disabled={nameLoading}
                    style={{
                        flex: 1,
                        padding: "12px",
                        border: "none",
                        borderRadius: "10px",
                        background: "#6d28d9",
                        color: "white",
                        fontWeight: "bold",
                        cursor: nameLoading ? "not-allowed" : "pointer"
                    }}
                >
                    {nameLoading ? "Saving..." : "Save Username"}
                </button>

                <button
                    onClick={() => setShowEditName(false)}
                    disabled={nameLoading}
                    style={{
                        padding: "12px 18px",
                        border: "none",
                        borderRadius: "10px",
                        background: "#eee",
                        color: "#333",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}
                        <div style={{ fontSize: "30px" }}>👑</div>
                        <h3 style={{ margin: "8px" }}>VIP Status</h3>
                        <p style={{ marginBottom: 0 }}>
                            Your premium account experience
                        </p>
                    </div>
                    <div
                        onClick={() => { localStorage.removeItem("auth-token"); window.location.href = "/"; }}
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
                            transition: "0.3s"
                        }}>
                        Logout
                    </div>
                    {/* Delete My Account */}
                    <button

                        onClick={async () => {
                            const confirmed = window.confirm(
                                "Are you sure you want to delete your account? Your account will be moved to Deleted Users, and you will be logged out."
                            );

                            if (!confirmed) return;

                            const token = localStorage.getItem("auth-token");

                            if (!token) {
                                window.alert("Please log in first.");
                                window.location.href = "/login";
                                return;
                            }

                            try {
                                const response = await fetch(
                                    "https://firest-backend.vercel.app/api/auth/delete-account",
                                    {
                                        method: "DELETE",
                                        headers: {
                                            "auth-token": token
                                        }
                                    }
                                );

                                const data = await response.json();

                                if (!response.ok || !data.success) {
                                    throw new Error(
                                        data.error || data.message || "Account deletion failed."
                                    );
                                }

                                // Clear the logged-in user's token
                                localStorage.removeItem("auth-token");

                                window.alert("Your account has been deleted successfully.");

                                // Redirect to home page
                                window.location.href = "/";
                            } catch (error) {
                                window.alert(error.message || "Something went wrong.");
                            }
                        }}

                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            gap: "10px",
                            marginTop: "12px",
                            padding: "14px 20px",
                            border: "2px solid #dc2626",
                            borderRadius: "12px",
                            background: "white",
                            color: "#dc2626",
                            fontWeight: "bold",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        🗑️ Delete My Account
                    </button>
                </div>


            </div>)}
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
