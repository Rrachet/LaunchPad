import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing setup token. Please use the link provided by your admin.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/set-password", { token, password });
      setSuccess(res.data?.message || "Password set successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-logo">L</div>
          <span className="brand-name">LaunchBoard</span>
        </div>
        <h1>
          Set your
          <br />
          <span className="gradient">password.</span>
        </h1>
        <p className="subtitle">
          Your admin created your account. Choose a password to start using LaunchBoard.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create your password</h2>
          <p className="auth-sub">Enter a new password for your account</p>

          {error && <div className="error-box">{error}</div>}
          {success && <div className="info-box">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Setting password...
                </>
              ) : (
                "Set Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
