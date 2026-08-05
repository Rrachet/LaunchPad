const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  deleteProject,
  updateProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

// All project routes are protected (require a valid JWT).
router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
