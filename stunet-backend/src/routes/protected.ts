import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
