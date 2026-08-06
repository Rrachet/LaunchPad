const nodemailer = require("nodemailer");

// Demo bookings are emailed to this host address.
const HOST_EMAIL = "amarnathmishra5200@gmail.com";

// Returns a transporter only if SMTP is configured.
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

// POST /api/demo/book
// Expects: { name, email, date, time }
const bookDemo = async (req, res) => {
  try {
    const { name, email, date, time } = req.body || {};

    if (!email || !date || !time) {
      return res.status(400).json({ message: "name, email, date and time are required" });
    }

    const transport = getTransport();

    if (!transport) {
      // No SMTP configured — log the booking so it's not lost.
      console.log("[demo] SMTP not configured. Skipping email send.");
      console.log(
        `[demo] Booking: ${name || ""} <${email}> on ${date} at ${time} -> ${HOST_EMAIL}`
      );
      return res.status(200).json({
        message: "Demo booked (email skipped — SMTP not configured)",
        emailed: false,
      });
    }

    await transport.sendMail({
      from: process.env.OTP_FROM_EMAIL || process.env.SMTP_USER,
      to: HOST_EMAIL,
      subject: "New LaunchPad Demo Booking",
      text: [
        "A new demo has been requested:",
        "",
        `Name: ${name || "—"}`,
        `Email: ${email}`,
        `Date: ${date}`,
        `Time: ${time}`,
      ].join("\n"),
      html: `
        <div style="font-family:sans-serif;background:#0b0f19;color:#e6edf7;padding:24px;border-radius:12px">
          <h2 style="margin-top:0">New LaunchPad Demo Booking</h2>
          <p style="color:#94a3b8">A potential customer would like to see a demo.</p>
          <table style="border-collapse:collapse;margin-top:12px">
            <tr><td style="padding:6px 12px;color:#94a3b8">Name</td><td style="padding:6px 12px"><b>${name || "—"}</b></td></tr>
            <tr><td style="padding:6px 12px;color:#94a3b8">Email</td><td style="padding:6px 12px"><b>${email}</b></td></tr>
            <tr><td style="padding:6px 12px;color:#94a3b8">Date</td><td style="padding:6px 12px"><b>${date}</b></td></tr>
            <tr><td style="padding:6px 12px;color:#94a3b8">Time</td><td style="padding:6px 12px"><b>${time}</b></td></tr>
          </table>
        </div>
      `,
    });

    return res.status(200).json({ message: "Demo booked & notified via email", emailed: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = { bookDemo };
