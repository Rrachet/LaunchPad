const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const https = require("https");
const jwt = require("jsonwebtoken");

const prisma = require("../utils/prisma");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (e) {
    done(e);
  }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// --- Stateless Google OAuth helpers (no session needed — works on Vercel serverless) ---

/**
 * Exchange an authorization code for Google tokens.
 */
function exchangeCodeForTokens(code, redirectUri) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const req = https.request(
      {
        hostname: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error("Failed to parse token response"));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

/**
 * Fetch the user's Google profile using an access token.
 */
function fetchGoogleProfile(accessToken) {
  return new Promise((resolve, reject) => {
    https.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error("Failed to parse profile response"));
          }
        });
      }
    );
  });
}

/**
 * Build the Google OAuth consent URL the frontend redirects to.
 */
function buildGoogleAuthUrl(redirectUri, state) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Handle the full Google OAuth callback: exchange code, fetch profile, upsert user, return JWT.
 */
async function handleGoogleCallback(code, redirectUri) {
  // 1. Exchange code for tokens
  const tokenRes = await exchangeCodeForTokens(code, redirectUri);
  if (tokenRes.error) {
    throw new Error(`Google token error: ${tokenRes.error_description || tokenRes.error}`);
  }

  // 2. Fetch user profile
  const profile = await fetchGoogleProfile(tokenRes.access_token);
  if (!profile.email) {
    throw new Error("Google account has no email");
  }

  // 3. Upsert user in DB
  const existing = await prisma.user.findUnique({ where: { email: profile.email } });

  let user;
  if (existing) {
    if (!existing.googleId) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { googleId: profile.id },
      });
    }
    user = await prisma.user.findUnique({ where: { email: profile.email } });
  } else {
    user = await prisma.user.create({
      data: {
        name: profile.name || profile.email.split("@")[0],
        email: profile.email,
        googleId: profile.id,
        emailVerified: true,
        passwordVerified: false,
        password: "",
      },
    });
  }

  // 4. Issue JWT
  const authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return { token: authToken, role: user.role, user };
}

// --- Passport Google Strategy (optional — for local dev with sessions) ---
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || "";

          if (!email) {
            return done(new Error("Google account has no email"));
          }

          const existing = await prisma.user.findUnique({ where: { email } });

          if (existing) {
            if (!existing.googleId) {
              await prisma.user.update({
                where: { id: existing.id },
                data: { googleId },
              });
            }
            return done(null, await prisma.user.findUnique({ where: { email } }));
          }

          const user = await prisma.user.create({
            data: {
              name,
              email,
              googleId,
              emailVerified: true,
              passwordVerified: false,
              password: "",
            },
          });

          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
} else {
  console.log("[passport] Google OAuth not configured. Email/password flow only.");
}

module.exports = passport;
module.exports.buildGoogleAuthUrl = buildGoogleAuthUrl;
module.exports.handleGoogleCallback = handleGoogleCallback;
