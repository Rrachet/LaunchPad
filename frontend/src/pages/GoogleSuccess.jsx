import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function GoogleSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!email) {
        setError("Missing email from Google callback.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        await API.post("/auth/email-otp/start", { email });
        navigate(`/register?email=${encodeURIComponent(email)}&stage=otp`);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to send OTP");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [email, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-logo">L</div>
          <span className="brand-name">LaunchBoard</span>
        </div>
        <h1>
          Almost there!
          <br />
          <span className="gradient">Verify your email.</span>
        </h1>
        <p className="subtitle">
          We've sent a verification code to your email to complete your signup.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Verifying your email...</h2>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
              <span className="spinner" />
              <span style={{ color: "var(--text-muted)" }}>Sending OTP to your email...</span>
            </div>
          )}

          {!loading && error && <div className="error-box" style={{ marginTop: 20 }}>{error}</div>}

          {!loading && !error && (
            <div className="info-box" style={{ marginTop: 20 }}>
              Redirecting to OTP verification...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleSuccess;
