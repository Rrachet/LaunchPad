const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const projectRoutes = require("./routes/projectRoutes");
const adminRoutes = require("./routes/adminRoutes");

const session = require("express-session");
const passport = require("./config/passport");

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // allow all origins (or set VITE_FRONTEND_URL for production)
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", dashboardRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("LaunchBoard API Running");
});

// Port (only start listening when run directly, not when imported by Vercel serverless)
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel serverless deployment
module.exports = app;
