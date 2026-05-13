import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET all applications for a specific job (Owned by employer)
router.get("/:jobId", requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;
        if (user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { jobId } = req.params;

        // Verify job belongs to employer
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job || job.employerId !== user.userId) {
            return res.status(403).json({ message: "Access denied or job not found" });
        }

        const applications = await prisma.application.findMany({
            where: { jobId },
            orderBy: { createdAt: "desc" },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        profile: true,
                        skills: {
                            include: { skill: true }
                        },
                        customSkills: true,
                        projects: true
                    },
                },
            },
        });

        const mappedApps = applications.map(app => ({
            ...app,
            resumeUrl: app.resumeUrl || app.student.profile?.resumeUrl || null
        }));

        res.json(mappedApps);
    } catch (error) {
        console.error("Fetch apps error:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
});

// PATCH application status
router.patch("/:applicationId/status", requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;
        if (user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { applicationId } = req.params;
        const { status } = req.body;

        // Verify application belongs to employer's job
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { job: true }
        });

        if (!application || application.job.employerId !== user.userId) {
            return res.status(403).json({ message: "Access denied or app not found" });
        }

        const updated = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });

        res.json(updated);
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
});

export default router;
