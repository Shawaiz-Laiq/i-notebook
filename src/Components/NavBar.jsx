import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const [name, setName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleSubmit = async () => {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        setName("");
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

        // Pehle response ko text mein read karo
        const text = await response.text();

        // Check karo ke backend JSON bhej raha hai
        let json;

        try {
          json = JSON.parse(text);
        } catch {
          console.error("Backend ne JSON ke bajaye ye response diya:", text);
          return;
        }

        if (!response.ok) {
          console.error("Failed to fetch user:", json);
          return;
        }

        setName(json.name ?? "");
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    };

    handleSubmit();
  }, [location.pathname]);

  return (
    <>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
            to="/home"
          >
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
            to="/about"
          >
            About
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === "/account" ? "active" : ""}`}
            to="/account"
          >
            Account
          </Link>
        </li>
         <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === "/received" ? "active" : ""}`}
            to="/received"
          >
            Received Notes
          </Link>
        </li>
         <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === "/sentnotes" ? "active" : ""}`}
            to="/sentnotes"
          >
            Sent Notes
          </Link>
        </li>

        <li className="nav-item">
          <div style={{ fontWeight: "500", margin: "8px" }}>
            {name}
          </div>
        </li>
      </ul>
    </>
  );
}

export default NavBar;