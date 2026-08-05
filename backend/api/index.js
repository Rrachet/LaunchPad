// Vercel serverless entry point for the LaunchBoard backend.
// Vercel's modern Node.js runtime natively supports Express apps
// that are exported directly, including JSON body parsing.
const app = require("../server");

module.exports = app;
