const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma = require("../utils/prisma");

// GET ALL CLIENT USERS (admin only)
// Returns all non-admin users with their verification status.
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        passwordVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// CREATE CLIENT USER (admin only)
// Creates a client with a one-time password setup token.
// Expects: { name, email }
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Generate a one-time token for the client to set their own password.
    const token = crypto.randomBytes(24).toString("hex");
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: "", // no password yet — client sets it via the token
        passwordVerified: false,
        emailVerified: true,
        role: "user",
        passwordSetupToken: token,
        passwordSetupExpiry: expiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        passwordVerified: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Client user created. Share the setup link with them.",
      user,
      setupToken: token,
      setupExpiry: expiry,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// UPDATE CLIENT USER (admin only)
// Expects: { name?, email? }
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body || {};

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existing.role === "admin") {
      return res.status(400).json({ message: "Cannot edit admin users" });
    }

    if (email && email !== existing.email) {
      const dup = await prisma.user.findUnique({ where: { email } });
      if (dup) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        passwordVerified: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ message: "User updated", user });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// DELETE CLIENT USER (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existing.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin users" });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// CHANGE CLIENT PASSWORD (admin only)
// Expects: { newPassword }
const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body || {};

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        passwordVerified: true,
        // Clear any outstanding setup token since password is now set.
        passwordSetupToken: null,
        passwordSetupExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// GET LOGIN/LOGOUT ACTIVITY (admin only)
// Returns all login/logout activity, newest first.
const getActivity = async (req, res) => {
  try {
    const activity = await prisma.userLogin.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: { name: true, role: true },
        },
      },
    });

    return res.status(200).json({ activity });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getActivity,
};
