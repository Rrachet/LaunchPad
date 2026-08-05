const crypto = require("crypto");
const bcrypt = require("bcryptjs");

function generateNumericOtp(len = 6) {
  const max = 10 ** len;
  const otp = Math.floor(Math.random() * max);
  return String(otp).padStart(len, "0");
}

async function hashOtp(otp) {
  const saltRounds = 10;
  return bcrypt.hash(otp, saltRounds);
}

async function verifyOtp({ otp, otpHash }) {
  return bcrypt.compare(otp, otpHash);
}

function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

module.exports = {
  generateNumericOtp,
  hashOtp,
  verifyOtp,
  sha256,
};

