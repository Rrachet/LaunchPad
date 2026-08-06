const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");

const { generateNumericOtp, hashOtp, verifyOtp } = require("../services/otpService");
const { sendOtpEmail } = require("../services/emailService");

const OTP_DEV_MODE = process.env.OTP_DEV_MODE === "true";

// GET CURRENT USER (authenticated)
// Expects: Authorization: Bearer <token>
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        passwordVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// REGISTER USER (email/password flow)
// Expects: { name, email, password }
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        passwordVerified: true,
      },
    });

    // Send email verification OTP
    const otp = generateNumericOtp(6);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        expiresAt,
        purpose: "email_verify",
      },
    });

    const subject = "Verify your LaunchBoard email";
    const text = `Your OTP is: ${otp}. It expires in 10 minutes.`;
    const html = `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`;

    try {
      await sendOtpEmail({ to: email, subject, text, html });
    } catch (e) {
      // In dev mode we still want to return the OTP even if SMTP is not configured.
      if (!OTP_DEV_MODE) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    }

    const response = {
      message: "User registered. Please verify your email with the OTP.",
      email,
      // In dev mode, return the OTP so you can test without a real SMTP server.
      ...(OTP_DEV_MODE ? { devOtp: otp } : {}),
    };

    return res.status(201).json(response);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// LOGIN STEP 1 — Verify credentials, send OTP to email, return a pending token.
// Expects: { email, password }
const loginOtpStart = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified || !user.passwordVerified) {
      return res
        .status(403)
        .json({ message: "Account not verified. Please complete signup verification." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Credentials are valid — now send an OTP to the user's email for 2FA.
    const otp = generateNumericOtp(6);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        expiresAt,
        purpose: "login_verify",
      },
    });

    const subject = "Your LaunchPad login code";
    try {
      await sendOtpEmail({
        to: email,
        subject,
        text: `Your login OTP is: ${otp}. It expires in 10 minutes.`,
        html: `<p>Your login OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
      });
    } catch (e) {
      if (!OTP_DEV_MODE) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    }

    // A short-lived token that proves credentials were verified (NOT the auth token).
    const pendingToken = jwt.sign(
      { id: user.id, email, purpose: "login_otp" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      message: "OTP sent to your email",
      pendingToken,
      ...(OTP_DEV_MODE ? { devOtp: otp } : {}),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// LOGIN STEP 2 — Verify OTP, issue the real JWT.
// Expects: { pendingToken, otp }
const loginOtpVerify = async (req, res) => {
  try {
    const { pendingToken, otp } = req.body || {};

    if (!pendingToken || !otp) {
      return res.status(400).json({ message: "pendingToken and otp are required" });
    }

    let payload;
    try {
      payload = jwt.verify(pendingToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: "Session expired. Please log in again." });
    }

    if (payload.purpose !== "login_otp") {
      return res.status(400).json({ message: "Invalid session token" });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latest = await prisma.emailOtp.findFirst({
      where: { userId: user.id, purpose: "login_verify" },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return res.status(400).json({ message: "No OTP found. Please request a new one." });
    if (latest.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    const ok = await verifyOtp({ otp, otpHash: latest.otpHash });
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // OTP verified — issue the real auth token.
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    try {
      await prisma.userLogin.create({
        data: { userId: user.id, email: user.email, action: "login" },
      });
    } catch (e) {
      console.error("[auth] Failed to record login activity:", e.message);
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// LEGACY LOGIN USER (kept for backward compatibility; direct JWT, no OTP)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.emailVerified || !user.passwordVerified) {
      return res.status(403).json({
        message: "Account not verified. Please complete signup verification."
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Record login activity
    try {
      await prisma.userLogin.create({
        data: {
          userId: user.id,
          email: user.email,
          action: "login",
        },
      });
    } catch (e) {
      console.error("[auth] Failed to record login activity:", e.message);
    }

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      error: error.message }
    );
  }
};

// LOGOUT USER (records logout activity)
// Expects: Authorization: Bearer <token>
const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.userLogin.create({
          data: {
            userId,
            email: user.email,
            action: "logout",
          },
        });
      }
    }
    return res.status(200).json({ message: "Logged out" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// --- Signup (Google + OTP + password) ---
// NOTE: Google OAuth is handled client-side by redirecting to /api/auth/google/start.
// For now, googleStart expects req.body { email, name, googleId } from your OAuth callback implementation.

const APP_SIGNUP_STATE_TTL_MS = 10 * 60 * 1000;

function makeStageJwt(payload) {
  // Temporary token for signup stages
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });
}

async function upsertUserForGoogle({ name, email, googleId }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // link google if missing
    if (!existing.googleId && googleId) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { googleId },
      });
    }
    return prisma.user.findUnique({ where: { email } });
  }

  return prisma.user.create({
    data: {
      name: name || "",
      email,
      googleId: googleId || null,
      // password will be set later
    }
  });
}

// POST /api/auth/google/start
// Optional compatibility endpoint.
// Not used by the new Passport redirect flow.
const googleStart = async (req, res) => {
  try {
    const { email, name, googleId } = req.body || {};
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await upsertUserForGoogle({ name, email, googleId });

    // ensure emailVerified is false until OTP verify
    if (user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: false }
      });
    }

    // Create signup stage token for frontend
    const stageToken = makeStageJwt({
      email,
      userId: user.id,
      stage: "google_verified"
    });

    return res.status(200).json({
      message: "Google linked. Verify email with OTP.",
      stageToken
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/email-otp/start
// Expects: { email }
const emailOtpStart = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateNumericOtp(6);
    const otpHash = await hashOtp(otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        expiresAt,
        purpose: "email_verify",
      }
    });

    const subject = "Your LaunchBoard email verification OTP";
    await sendOtpEmail({
      to: email,
      subject,
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.status(200).json({
      message: "OTP sent",
      ...(OTP_DEV_MODE ? { devOtp: otp } : {}),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/email-otp/verify
// Expects: { email, otp }
const emailOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ message: "email and otp are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const latest = await prisma.emailOtp.findFirst({
      where: { userId: user.id, purpose: "email_verify" },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return res.status(400).json({ message: "No OTP found" });
    if (latest.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtp({ otp, otpHash: latest.otpHash });
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    res.status(200).json({ message: "Email verified" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/password-otp/start
// Expects: { email }
const passwordOtpStart = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateNumericOtp(6);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        expiresAt,
        purpose: "password_verify",
      }
    });

    const subject = "Set your LaunchBoard password OTP";
    await sendOtpEmail({
      to: email,
      subject,
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.status(200).json({
      message: "OTP sent",
      ...(OTP_DEV_MODE ? { devOtp: otp } : {}),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/password-otp/verify
// Expects: { email, otp }
const passwordOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ message: "email and otp are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const latest = await prisma.emailOtp.findFirst({
      where: { userId: user.id, purpose: "password_verify" },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return res.status(400).json({ message: "No OTP found" });
    if (latest.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtp({ otp, otpHash: latest.otpHash });
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordVerified: true },
    });

    res.status(200).json({ message: "Password OTP verified" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/password/complete
// Expects: { email, password }
const passwordComplete = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // If you want OTP gate before allowing password set:
    // require passwordVerified=true
    if (!user.passwordVerified) {
      return res.status(403).json({ message: "Password OTP not verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // keep flags as-is
      }
    });

    res.status(200).json({ message: "Signup completed" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/set-password
// Client sets their own password using the one-time setup token created by admin.
// Expects: { token, password }
const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ message: "token and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await prisma.user.findUnique({
      where: { passwordSetupToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired setup link" });
    }

    if (!user.passwordSetupExpiry || user.passwordSetupExpiry < new Date()) {
      return res.status(400).json({ message: "Setup link has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordVerified: true,
        passwordSetupToken: null,
        passwordSetupExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password set successfully. You can now log in." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
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
  setPassword
};
