import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Icon from "../components/Icon";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      // Route based on role: admins go to the admin panel, everyone else to the dashboard.
      if (res.data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
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
                  <span className="spinner" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-footer">
            New here?
            <button type="button" className="link" onClick={() => navigate("/register")}>
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
