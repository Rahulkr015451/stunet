import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Employer: create job
router.post("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  if (!user || user.role !== "employer") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { title, company, location, description, type } = req.body;

  const job = await prisma.job.create({
    data: {
      title,
      company,
      location,
      description,
      type,
      employerId: user.userId,
    },
  });

  res.json(job);
});

// Employer: list own jobs
router.get("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  if (!user || user.role !== "employer") {
    return res.status(403).json({ message: "Access denied" });
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  });

  res.json(jobs);
});

export default router;
