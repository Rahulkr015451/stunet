import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * GET /api/profile
 * Fetch logged-in user's profile
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/**
 * PUT /api/profile
 * Create or update logged-in user's profile
 */
router.put("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { name, college, degree, graduationYear, bio, resumeUrl, linkedInUrl, location } = req.body;

    // 1. Update the linked User row with the new name
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // 2. Upsert the localized Profile record
    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        college,
        degree,
        graduationYear,
        bio,
        resumeUrl,
        linkedInUrl,
        location,
      },
      create: {
        userId,
        college,
        degree,
        graduationYear,
        bio,
        resumeUrl,
        linkedInUrl,
        location,
      },
      include: {
        user: { select: { name: true, image: true } }
      }
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to save profile" });
  }
});

/**
 * POST /api/profile/avatar
 * Update logged-in user's avatar image URL
 */
router.post("/avatar", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: { image: true },
    });

    res.json({ image: updatedUser.image });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload avatar" });
  }
});

export default router;
