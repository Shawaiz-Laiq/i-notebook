
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://firest-backend.vercel.app";

export default function SessionWatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("auth-token");

      // Login nahi hai to kuch nahi karna
      if (!token) return;

      try {
        const response = await fetch(`${API}/api/auth/heartbeat`, {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("auth-token");
          navigate("/", { replace: true });
        }
      } catch (error) {
        // Network error par user ko logout nahi karna
        console.log("Session check failed:", error);
      }
    };

    checkSession();

    const interval = setInterval(checkSession, 10000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
}
