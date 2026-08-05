const prisma = require("../utils/prisma");

// Ensures the authenticated user has role === 'admin'.
// Must be used AFTER authMiddleware so req.user.id is populated.
module.exports = async function requireAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
