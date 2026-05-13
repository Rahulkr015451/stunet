import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * Follow an employer
 * POST /api/follow/:employerId
 */
router.post("/:employerId", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can follow employers." });
    }

    const employerId = req.params.employerId;

    // Verify the target is an employer
    const employer = await prisma.user.findUnique({
      where: { id: employerId },
    });

    if (!employer || employer.role !== "employer") {
      return res.status(404).json({ message: "Employer not found." });
    }

    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.userId,
          followingId: employerId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Already following this employer." });
    }

    await prisma.follow.create({
      data: {
        followerId: user.userId,
        followingId: employerId,
      },
    });

    res.status(201).json({ success: true, message: "Followed successfully." });
  } catch (error) {
    console.error("FOLLOW ERROR:", error);
    res.status(500).json({ message: "Failed to follow employer." });
  }
});

/**
 * Unfollow an employer
 * DELETE /api/follow/:employerId
 */
router.delete("/:employerId", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can unfollow employers." });
    }

    const employerId = req.params.employerId;

    await prisma.follow.deleteMany({
      where: {
        followerId: user.userId,
        followingId: employerId,
      },
    });

    res.json({ success: true, message: "Unfollowed successfully." });
  } catch (error) {
    console.error("UNFOLLOW ERROR:", error);
    res.status(500).json({ message: "Failed to unfollow employer." });
  }
});

/**
 * Check follow status
 * GET /api/follow/status/:employerId
 */
router.get("/status/:employerId", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.userId,
          followingId: req.params.employerId,
        },
      },
    });

    res.json({ following: !!existing });
  } catch (error) {
    console.error("FOLLOW STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to check follow status." });
  }
});

/**
 * Get list of employers the student follows
 * GET /api/follow/following
 */
router.get("/following", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied." });
    }

    const follows = await prisma.follow.findMany({
      where: { followerId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            jobs: {
              where: { status: "APPROVED" },
              select: { id: true },
            },
            _count: {
              select: {
                followers: true,
              },
            },
          },
        },
      },
    });

    // Flatten to a cleaner response
    const employers = follows.map((f) => ({
      id: f.following.id,
      name: f.following.name,
      email: f.following.email,
      image: f.following.image,
      activeJobs: f.following.jobs.length,
      followerCount: f.following._count.followers,
      followedAt: f.createdAt,
      // Get company name from their jobs
      company: null as string | null,
    }));

    // Fetch company names from jobs
    for (const emp of employers) {
      const job = await prisma.job.findFirst({
        where: { employerId: emp.id },
        select: { company: true },
      });
      emp.company = job?.company || null;
    }

    res.json(employers);
  } catch (error) {
    console.error("FOLLOWING LIST ERROR:", error);
    res.status(500).json({ message: "Failed to fetch following list." });
  }
});

/**
 * Get jobs feed from followed employers
 * GET /api/follow/feed
 */
router.get("/feed", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied." });
    }

    // Get IDs of employers the student follows
    const follows = await prisma.follow.findMany({
      where: { followerId: user.userId },
      select: { followingId: true },
    });

    const employerIds = follows.map((f) => f.followingId);

    if (employerIds.length === 0) {
      return res.json([]);
    }

    // Get approved jobs from followed employers
    const jobs = await prisma.job.findMany({
      where: {
        employerId: { in: employerIds },
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error("FEED ERROR:", error);
    res.status(500).json({ message: "Failed to fetch feed." });
  }
});

/**
 * Get list of students following the employer
 * GET /api/follow/followers
 */
router.get("/followers", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    if (user.role !== "employer") {
      return res.status(403).json({ message: "Access denied." });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                college: true,
                degree: true,
              }
            }
          },
        },
      },
    });

    res.json(followers.map(f => ({
      id: f.follower.id,
      name: f.follower.name,
      email: f.follower.email,
      image: f.follower.image,
      college: f.follower.profile?.college,
      degree: f.follower.profile?.degree,
      followedAt: f.createdAt,
    })));
  } catch (error) {
    console.error("FOLLOWERS LIST ERROR:", error);
    res.status(500).json({ message: "Failed to fetch followers list." });
  }
});

export default router;
