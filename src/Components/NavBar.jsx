import {Link, useLocation} from "react-router-dom"
import { useState } from "react";



function NavBar() {
      const token = localStorage.getItem("token");
      const [name, setname] = useState('')

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

            if (!response.ok) {
                console.error("Failed to fetch user:", json);
                return;
            }

            setname(json.name ?? "");
        } catch (error) {
            console.error("Something went wrong:", error.message);
        }
    };
     handleSubmit()
   



    
    let location = useLocation();

    
    
    return (
    <>
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/home" ? "active" : "" } `} aria-current="page" to="/home">Home</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/about" ? "active" : "" } `} to="/about">About</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/account" ? "active" : "" } `}  to="/account">Account</Link>
            </li>
            <li className="nav-item">
                <div style={{fontWeight: "500" ,margin: "8px"}}>{name}</div>
            </li>
        </ul>
    </>
    )
}
export default NavBar;