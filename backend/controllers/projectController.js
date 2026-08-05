const prisma = require("../utils/prisma");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { name, status, owner } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        status,
        owner
      }
    });

    res.status(201).json(project);

  } catch (error) {
    console.log("CREATE ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
};


// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();

    res.status(200).json(projects);

  } catch (error) {
    console.log("GET ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
};


// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE ROUTE HIT:", id);

    await prisma.project.delete({
      where: {
        id: id
      }
    });

    res.status(200).json({
      message: "Project Deleted"
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
};


// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    console.log("UPDATE ROUTE HIT");

    const { id } = req.params;
    const { name, status, owner } = req.body;

    
    const updatedProject = await prisma.project.update({
      where: {
        id: id
      },
      data: {
        name,
        status,
        owner
      }
    });

    res.status(200).json(updatedProject);

  } catch (error) {
    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
};


// EXPORTS
module.exports = {
  createProject,
  getProjects,
  deleteProject,
  updateProject
};