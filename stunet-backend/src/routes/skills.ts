import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * GET /api/skills
 * Returns:
 * - available predefined skills
 * - user's predefined skills
 * - user's custom skills
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const available = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    });

    const predefined = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { skill: { name: "asc" } },
    });

    const custom = await prisma.customSkill.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    res.json({
      available,
      predefined,
      custom,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
});

/**
 * POST /api/skills
 * Add or update a predefined or custom skill
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { skillId, name, level } = req.body;

    if (!level) {
      return res.status(400).json({ message: "Skill level required" });
    }

    // Predefined skill
    if (skillId) {
      const skill = await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId,
          },
        },
        update: { level },
        create: {
          userId,
          skillId,
          level,
        },
      });

      return res.json(skill);
    }

    // Custom skill
    if (name) {
      const skill = await prisma.customSkill.upsert({
        where: {
          userId_name: {
            userId,
            name,
          },
        },
        update: { level },
        create: {
          userId,
          name,
          level,
        },
      });

      return res.json(skill);
    }

    res.status(400).json({ message: "Invalid skill payload" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save skill" });
  }
});

/**
 * DELETE /api/skills/:id
 * Query param: type=predefined | custom
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const type = req.query.type;

    if (!id) {
      return res.status(400).json({ message: "Skill ID required" });
    }

    if (type === "predefined") {
      await prisma.userSkill.delete({
        where: { id },
      });
    } else if (type === "custom") {
      await prisma.customSkill.delete({
        where: { id },
      });
    } else {
      return res.status(400).json({ message: "Invalid skill type" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill" });
  }
});

export default router;
