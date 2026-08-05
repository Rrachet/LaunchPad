// Vercel serverless entry point for the LaunchBoard backend.
// This wraps the Express app so all /api/* routes work on Vercel.
const app = require("../server");

module.exports = app;
