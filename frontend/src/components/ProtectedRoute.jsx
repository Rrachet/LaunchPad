import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | authed | unauthed

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthed");
        return;
      }

      try {
        const res = await API.get("/auth/me");
        // If the logged-in user is an admin, send them to the admin panel instead.
        if (res.data?.user?.role === "admin") {
          setStatus("forbidden");
          return;
        }
        setStatus("authed");
      } catch {
        // Invalid/expired token.
        localStorage.removeItem("token");
        setStatus("unauthed");
      }
    };

    verify();
  }, []);

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  if (status === "unauthed") {
    return <Navigate to="/" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
