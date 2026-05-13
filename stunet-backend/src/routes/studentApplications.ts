import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET all applications submitted by the student
router.get("/", requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;
        if (user.role !== "student") {
            return res.status(403).json({ message: "Access denied" });
        }

        const applications = await prisma.application.findMany({
            where: { studentId: user.userId },
            orderBy: { createdAt: "desc" },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: true,
                        location: true,
                        type: true,
                    }
                }
            },
        });

        res.json(applications);
    } catch (error) {
        console.error("Student apps error:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
});

export default router;
