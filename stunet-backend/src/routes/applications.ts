import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

/**
 * Check if student already applied to job
 */
const router = Router();

router.get(
  "/jobs/:id/applied",
  requireAuth,
  async (req, res) => {
    const user = (req as any).user;

    if (user.role !== "student") {
      return res.json({ applied: false });
    }

    const existing = await prisma.application.findFirst({
      where: {
        jobId: req.params.id,
        studentId: user.userId,
      },
    });

    res.json({ applied: !!existing });
  }
);

/**
 * Apply to a job
 */
router.post(
  "/jobs/:id/apply",
  requireAuth,
  async (req, res) => {
    try {
      const user = (req as any).user;

      if (user.role !== "student") {
        return res.status(403).json({ message: "Only students can apply to jobs." });
      }

      const jobId = req.params.id;
      const { resumeData } = req.body || {};

      // Find the job to get the employerId
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found." });
      }

      // Check if already applied
      const existing = await prisma.application.findFirst({
        where: {
          jobId,
          studentId: user.userId,
        },
      });

      if (existing) {
        return res.status(400).json({ message: "Already applied." });
      }

      // Create new application
      await prisma.application.create({
        data: {
          jobId,
          studentId: user.userId,
          employerId: job.employerId,
          status: "APPLIED",
          resumeUrl: resumeData || null,
        },
      });

      res.status(201).json({ success: true, message: "Applied successfully." });
    } catch (error) {
      console.error("APPLY ERROR:", error);
      res.status(500).json({ message: "Failed to apply." });
    }
  }
);

export default router;
