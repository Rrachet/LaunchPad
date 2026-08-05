const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getActivity,
} = require("../controllers/adminController");

// All admin routes require a valid JWT AND admin role.
router.use(authMiddleware);
router.use(requireAdmin);

router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/password", changeUserPassword);
router.get("/activity", getActivity);

module.exports = router;
