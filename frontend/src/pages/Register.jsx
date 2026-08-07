import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import Icon from "../components/Icon";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Support the Google OAuth flow: /register?email=...&stage=otp
  const queryEmail = searchParams.get("email") || "";
  const startStage = searchParams.get("stage") === "otp" ? "otp" : "account";

  // Step 1: Account details
  const [name, setName] = useState("");
  const [email, setEmail] = useState(queryEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Step 2: OTP verification
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [stage, setStage] = useState(startStage); // account | otp
  const [devOtp, setDevOtp] = useState(null);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password });
      // In dev mode the backend returns the OTP for testing.
      if (res.data?.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setStage("otp");
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setOtpLoading(true);
    try {
await API.post("/auth/email-otp/verify", { email, otp });
alert("Email verified! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
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
          Create your
          <br />
          <span className="gradient">workspace today.</span>
        </h1>

        <p className="subtitle">
          Sign up in under a minute and start managing projects like a pro.
        </p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-check">✓</div>
            Create your company workspace
          </div>
          <div className="feature-item">
            <div className="feature-check">✓</div>
            Get instant insights
          </div>
          <div className="feature-item">
            <div className="feature-check">✓</div>
            Manage projects in one place
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {stage === "account" ? (
            <>
              <h2>Create account</h2>
              <p className="auth-sub">Get started with LaunchPad</p>

              {error && <div className="error-box">{error}</div>}

              <form onSubmit={handleRegister}>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

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
                      placeholder="At least 6 characters"
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

                <div className="field">
                  <label>Confirm Password</label>
                  <div className="password-wrap">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
<button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      <Icon name={showConfirm ? "eyeOff" : "eye"} size={18} />
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={registerLoading}>
                  {registerLoading ? (
                    <>
                      <span className="spinner" /> Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Verify your email</h2>
              <p className="auth-sub">
                We sent a verification code to <b style={{ color: "var(--text)" }}>{email}</b>
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

                <button type="submit" className="btn btn-primary" disabled={otpLoading}>
                  {otpLoading ? (
                    <>
                      <span className="spinner" /> Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </form>

              <div style={{ marginTop: 14, textAlign: "center" }}>
                <button
                  type="button"
                  className="link"
                  style={{ background: "none", border: "none", color: "var(--primary-light)", cursor: "pointer", fontSize: 14 }}
                  onClick={() => setStage("account")}
                >
                  ← Back to account details
                </button>
              </div>
            </>
          )}

          <div className="auth-footer">
            Already have an account?
            <button type="button" className="link" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
