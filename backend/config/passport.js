const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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

// Google OAuth is OPTIONAL. The email/password flow works without it.
// Only register the Google strategy when credentials are provided.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
              passwordVerified: false,
              emailVerified: false,
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
  console.log(
    "[passport] Google OAuth not configured. Email/password flow only."
  );
}

module.exports = passport;
