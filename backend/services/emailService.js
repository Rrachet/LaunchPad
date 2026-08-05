const nodemailer = require("nodemailer");

// Returns a transporter only if SMTP config is present.
// In dev mode (OTP_DEV_MODE=true) no SMTP is required — the OTP is returned in the API response.
function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;

  if (!host || !user) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOtpEmail({ to, subject, html, text }) {
  const transport = getTransport();

  if (!transport) {
    // No SMTP configured — this is expected in development.
    // The OTP is returned in the API response when OTP_DEV_MODE=true.
    console.log("[emailService] SMTP not configured. Skipping email send.");
    console.log(`[emailService] Would send to: ${to} | subject: ${subject}`);
    return;
  }

  const from = process.env.OTP_FROM_EMAIL || process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendOtpEmail };
