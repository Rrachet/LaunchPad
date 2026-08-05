const express = require("express");
const router = express.Router();

const passport = require("../config/passport");

const {
  loginUser,
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

// Public auth routes
router.post("/register", registerUser);
router.get("/me", authMiddleware, getMe);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const email = req.user?.email;

    const frontendSuccessUrl =
      process.env.FRONTEND_GOOGLE_SUCCESS_URL ||
      "http://localhost:5173/google-success";

    const redirectUrl = email
      ? `${frontendSuccessUrl}?email=${encodeURIComponent(email)}`
      : frontendSuccessUrl;

    return res.redirect(302, redirectUrl);
  }
);

router.post("/email-otp/start", emailOtpStart);
router.post("/email-otp/verify", emailOtpVerify);
router.post("/password-otp/start", passwordOtpStart);
router.post("/password-otp/verify", passwordOtpVerify);
router.post("/password/complete", passwordComplete);
router.post("/set-password", setPassword);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
