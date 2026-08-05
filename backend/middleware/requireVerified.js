const prisma = require("../utils/prisma");

// Verifies that the authenticated user has confirmed their email.
// Loads the user from the DB so we always have fresh verification flags.
module.exports = async function requireVerified(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { emailVerified: true, passwordVerified: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified || !user.passwordVerified) {
      return res.status(403).json({
        message: "Email and password must be verified before accessing this resource",
      });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
