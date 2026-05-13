import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * GET /api/projects
 * Fetch logged-in user's projects
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

/**
 * POST /api/projects
 * Create a project
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const {
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      isPublic,
    } = req.body;

    if (!title || !description || !techStack) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description,
        techStack,
        githubUrl,
        liveUrl,
        isPublic,
      },
    });

    res.json(project);
  } catch {
    res.status(500).json({ message: "Failed to create project" });
  }
});

/**
 * PUT /api/projects/:id
 * Update own project
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update project" });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete own project
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.project.delete({ where: { id } });

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

/**
 * GET /api/projects/public
 * Fetch public projects of logged-in user
 */
router.get("/public", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const projects = await prisma.project.findMany({
      where: {
        userId,
        isPublic: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch public projects" });
  }
});


export default router;
