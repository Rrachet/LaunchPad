const express = require("express");
const router = express.Router();

const passport = require("../config/passport");
const { buildGoogleAuthUrl, handleGoogleCallback } = passport;

const {
  loginUser,
  loginOtpStart,
  loginOtpVerify,
  getMe,
  registerUser,
  logoutUser,
  googleStart,
  emailOtpStart,
  emailOtpVerify,
  passwordOtpStart,
  passwordOtpVerify,
  passwordComplete,
  setPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// --- Stateless Google OAuth (serverless-safe on Vercel) ---

// Derive the deployed backend origin from the request (handles any domain).
// IMPORTANT: Vercel sits behind a reverse proxy, so req.protocol is "http".
// We must trust the x-forwarded-proto header, otherwise the redirect URI sent
// to Google would be http://... and Google rejects it with
// "access blocked - this app's request is invalid" (redirect_uri mismatch).
const getBackendOrigin = (req) => {
  if (process.env.BACKEND_PUBLIC_URL) return process.env.BACKEND_PUBLIC_URL;
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "https")
    .toString()
    .split(",")[0]
    .trim();
  const host = req.get("host");
  return host ? `${proto}://${host}` : "http://localhost:5000";
};

// Derive the frontend base URL for post-login redirects.
// The frontend passes its origin embedded in the OAuth "state" parameter
// (Google preserves state through the redirect). FRONTEND_GOOGLE_SUCCESS_URL
// env var is the fallback, then a guess.
const getFrontendBaseUrl = (req) => {
  // Try to extract from the "state" parameter (preserved through Google's redirect)
  if (req.query?.state) {
    try {
      const state = JSON.parse(decodeURIComponent(req.query.state));
      if (state.returnUrl) return String(state.returnUrl).replace(/\/+$/, "");
    } catch {
      // state is not JSON-encoded; ignore
    }
  }
  if (process.env.FRONTEND_GOOGLE_SUCCESS_URL) {
    return process.env.FRONTEND_GOOGLE_SUCCESS_URL.replace(/\/google-success.*$/, "");
  }
  return req?.get("host")?.startsWith("api.")
    ? "https://launchpad-gamma.vercel.app"
    : "http://localhost:5173";
};

// GET /api/auth/google — start Google OAuth (stateless, no session)
router.get("/google", (req, res) => {
  const origin = getBackendOrigin(req);
  const redirectUri = `${origin}/api/auth/google/callback`;
  // Encode the frontend return_url (if any) into the OAuth state parameter
  // so Google preserves it through the redirect back to our callback.
  let state = req.query.state || "launchpad";
  if (req.query.return_url) {
    state = JSON.stringify({ returnUrl: req.query.return_url, _: state });
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res
      .status(500)
      .send("Google OAuth is not configured on the server (missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).");
  }

  const url = buildGoogleAuthUrl(redirectUri, state);
  return res.redirect(302, url);
});

// GET /api/auth/google/callback — handle Google redirect (stateless)
router.get("/google/callback", async (req, res) => {
  try {
    const { code, error: googleError } = req.query;

    const frontendBase = getFrontendBaseUrl(req);
    const frontendSuccessUrl = `${frontendBase}/google-success`;
    const frontendLoginUrl = `${frontendBase}/login`;

    if (googleError) {
      return res.redirect(
        302,
        `${frontendLoginUrl}?google_error=${encodeURIComponent(googleError)}`
      );
    }

    if (!code) {
      return res.redirect(
        302,
        `${frontendLoginUrl}?google_error=${encodeURIComponent("missing_code")}`
      );
    }

    const origin = getBackendOrigin(req);
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange code, fetch profile, upsert user, get JWT.
    const { token, role, user } = await handleGoogleCallback(code, redirectUri);

    // Record login activity (best-effort).
    try {
      const prisma = require("../utils/prisma");
      await prisma.userLogin.create({
        data: { userId: user.id, email: user.email, action: "login" },
      });
    } catch (e) {
      console.error("[auth] Failed to record login activity:", e.message);
    }

    const redirectUrl =
      `${frontendSuccessUrl}?email=${encodeURIComponent(user.email)}` +
      `&token=${encodeURIComponent(token)}&role=${role || "user"}`;

    return res.redirect(302, redirectUrl);
  } catch (e) {
    console.error("[auth] Google callback error:", e.message);
    const frontendBase = getFrontendBaseUrl(req);
    const frontendLoginUrl = `${frontendBase}/login`;
    return res.redirect(
      302,
      `${frontendLoginUrl}?google_error=${encodeURIComponent(e.message)}`
    );
  }
});

router.post("/email-otp/start", emailOtpStart);
router.post("/email-otp/verify", emailOtpVerify);
router.post("/password-otp/start", passwordOtpStart);
router.post("/password-otp/verify", passwordOtpVerify);
router.post("/password/complete", passwordComplete);
router.post("/set-password", setPassword);
router.post("/login", loginUser);
router.post("/login-otp/start", loginOtpStart);
router.post("/login-otp/verify", loginOtpVerify);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
