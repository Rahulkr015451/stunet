import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

/**
 * Create a course
 */
router.post(
  "/courses",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const { title, description, link } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        link,
      },
    });

    res.json(course);
  }
);

/**
 * Get all courses
 */
router.get(
  "/courses",
  requireAuth,
  requireAdmin,
  async (_req, res) => {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(courses);
  }
);

export default router;
