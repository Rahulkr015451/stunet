import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * Get all approved jobs (public)
 */
router.get("/jobs", async (_req, res) => {
  const jobs = await prisma.job.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      type: true,
      createdAt: true,
    },
  });

  res.json(jobs);
});

/**
 * Get single approved job (public)
 */
router.get("/jobs/:id", async (req, res) => {
  const job = await prisma.job.findFirst({
    where: {
      id: req.params.id,
      status: "APPROVED",
    },
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job);
});

export default router;
