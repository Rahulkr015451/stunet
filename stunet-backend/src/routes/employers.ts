import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * List all employers with job counts and follower counts
 * GET /api/employers
 */
router.get("/", async (_req, res) => {
  try {
    const employers = await prisma.user.findMany({
      where: { role: "employer" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            jobs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get company name and active job count for each employer
    const enriched = await Promise.all(
      employers.map(async (emp) => {
        const job = await prisma.job.findFirst({
          where: { employerId: emp.id },
          select: { company: true },
        });

        const activeJobsData = await prisma.job.findMany({
          where: {
            employerId: emp.id,
            status: "APPROVED",
          },
          select: { location: true },
        });

        const activeJobCount = activeJobsData.length;
        const locations = Array.from(new Set(activeJobsData.map((j) => j.location).filter(Boolean)));

        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          image: emp.image,
          company: job?.company || null,
          totalJobs: emp._count.jobs,
          activeJobs: activeJobCount,
          locations: locations,
          followerCount: emp._count.followers,
          joinedAt: emp.createdAt,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error("EMPLOYERS LIST ERROR:", error);
    res.status(500).json({ message: "Failed to fetch employers." });
  }
});

/**
 * Get single employer profile with their approved jobs
 * GET /api/employers/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const employer = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        role: "employer",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            jobs: true,
          },
        },
      },
    });

    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    const approvedJobs = await prisma.job.findMany({
      where: {
        employerId: employer.id,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        description: true,
        type: true,
        createdAt: true,
      },
    });

    const company = approvedJobs.length > 0 ? approvedJobs[0].company : null;

    res.json({
      id: employer.id,
      name: employer.name,
      email: employer.email,
      image: employer.image,
      company,
      totalJobs: employer._count.jobs,
      activeJobs: approvedJobs.length,
      followerCount: employer._count.followers,
      joinedAt: employer.createdAt,
      jobs: approvedJobs,
    });
  } catch (error) {
    console.error("EMPLOYER PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch employer profile." });
  }
});

export default router;
