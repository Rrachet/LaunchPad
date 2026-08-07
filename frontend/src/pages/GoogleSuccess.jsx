import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GoogleSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role") || "user";

    if (token) {
      localStorage.setItem("token", token);
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      // No token — fall back to email-based OTP flow (existing behavior).
      const email = params.get("email") || "";
      if (email) {
        navigate(`/register?email=${encodeURIComponent(email)}&stage=otp`, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [location.search, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-logo">L</div>
          <span className="brand-name">LaunchPad</span>
        </div>
        <h1>
          Almost there!
          <br />
          <span className="gradient">Signing you in...</span>
        </h1>
        <p className="subtitle">
          Please wait while we complete your Google sign-in.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Signing you in...</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <span className="spinner" />
            <span style={{ color: "var(--text-muted)" }}>Authenticating with Google...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleSuccess;
