import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | authed | unauthed | forbidden

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthed");
        return;
      }

      try {
        const res = await API.get("/auth/me");
        if (res.data?.user?.role === "admin") {
          setStatus("authed");
        } else {
          setStatus("forbidden");
        }
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
        <div>Loading admin panel...</div>
      </div>
    );
  }

  if (status === "unauthed") {
    return <Navigate to="/" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
