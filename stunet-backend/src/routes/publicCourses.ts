import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * Get all courses for public viewing
 */
router.get(
    "/courses",
    async (_req, res) => {
        try {
            const courses = await prisma.course.findMany({
                orderBy: { createdAt: "desc" },
            });

            res.json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    }
);

export default router;
