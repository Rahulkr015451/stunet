import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

/**
 * Get all pending jobs
 */
router.get(
  "/jobs",
  requireAuth,
  requireAdmin,
  async (_req, res) => {
    const jobs = await prisma.job.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  }
);

/**
 * Approve a job
 */
router.patch(
  "/jobs/:id/approve",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { status: "APPROVED" },
    });

    res.json(job);
  }
);

export default router;
