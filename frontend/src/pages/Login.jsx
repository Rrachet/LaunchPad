import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Icon from "../components/Icon";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 (OTP)
  const [pendingToken, setPendingToken] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth. The callback lands on /google-success.
    // VITE_API_URL may include a trailing "/api", so strip it to get the host.
    const raw = import.meta.env.VITE_API_URL || "https://launchpad-backend-zeta.vercel.app/api";
    const base = raw.replace(/\/api\/?$/, "");
    // Pass the frontend origin so the backend can redirect back here after
    // Google auth completes (works on any domain, including localhost).
    const returnUrl = encodeURIComponent(window.location.origin);
    window.location.href = `${base}/api/auth/google?return_url=${returnUrl}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login-otp/start", { email, password });
      setPendingToken(res.data.pendingToken);
      if (res.data?.devOtp) setDevOtp(res.data.devOtp);
      setOtp("");
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login-otp/verify", { pendingToken, otp });
      localStorage.setItem("token", res.data.token);
      if (res.data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setPendingToken("");
    setOtp("");
    setDevOtp(null);
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-logo">
            <img src="/LP1.png" alt="LaunchPad logo" className="brand-logo-img" />
          </div>
          <span className="brand-name">LaunchPad</span>
        </div>

        <h1>
          Manage everything
          <br />
          <span className="gradient">from one place.</span>
        </h1>

        <p className="subtitle">
          Your intelligent dashboard for projects, analytics and team workflows.
        </p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-check">✓</div>
            Company insights &amp; KPIs
          </div>
          <div className="feature-item">
            <div className="feature-check">✓</div>
            Project management
          </div>
          <div className="feature-item">
            <div className="feature-check">✓</div>
            Charts &amp; activity feeds
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {!pendingToken ? (
            <>
              <h2>Welcome back</h2>
              <p className="auth-sub">Sign in to your account to continue</p>

              {error && <div className="error-box">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Checking...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="divider-row">
                <span>or</span>
              </div>

              <button
                type="button"
                className="btn btn-google"
                onClick={handleGoogleLogin}
              >
                <span className="google-g">G</span>
                Continue with Google
              </button>

              <div className="auth-footer">
                New here?
                <button type="button" className="link" onClick={() => navigate("/register")}>
                  Create an account
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Verify it's you</h2>
              <p className="auth-sub">
                We sent a login code to <b style={{ color: "var(--text)" }}>{email}</b>
              </p>

              {devOtp && (
                <div className="dev-otp">
                  <span>Dev mode OTP</span>
                  <strong>{devOtp}</strong>
                </div>
              )}

              {error && <div className="error-box">{error}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="field">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </form>

              <div style={{ marginTop: 14, textAlign: "center" }}>
                <button
                  type="button"
                  className="link"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary-light)",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  onClick={resetToLogin}
                >
                  ← Back to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
