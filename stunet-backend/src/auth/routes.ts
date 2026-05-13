import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

const router = Router();

// Production-aware cookie config
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
};

/**
 * 🟡 STEP 1: Email & Password Registration
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const requestedRole = role === "employer" ? "employer" : "student";

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.role !== requestedRole && existingUser.role !== "admin") {
        return res.status(400).json({ message: `Email already registered as ${existingUser.role}.` });
      } else {
        return res.status(400).json({ message: "User already exists. Please log in." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        role: requestedRole,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({ user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name } });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

/**
 * 🟡 STEP 2: Email & Password Login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const requestedRole = role === "employer" ? "employer" : "student";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.role !== requestedRole && user.role !== "admin") {
      return res.status(403).json({ message: `Role mismatch. Try logging in as ${user.role}.` });
    }

    if (!user.password) {
      return res.status(401).json({ message: "Please log in with Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

/**
 * 🔵 STEP 3: Start Google OAuth
 * role is passed via OAuth state
 */
router.get("/google", (req, res, next) => {
  const role = req.query.role;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role as string, // 🔐 persist role via OAuth state
  })(req, res, next);
});

/**
 * 🔵 STEP 4: Google OAuth callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=role_mismatch`,
  }),
  (req, res) => {
    const user = req.user as any;

    console.log("AUTH CALLBACK USER:", {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    // ✅ ROLE-BASED REDIRECT
    if (user.role === "admin") {
      return res.redirect(`${process.env.CLIENT_URL}/admin`);
    }

    if (user.role === "employer") {
      return res.redirect(`${process.env.CLIENT_URL}/employer/dashboard`);
    }

    // student / default
    return res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

/**
 * 🔴 STEP 5: Logout
 */
router.get("/logout", (_req, res) => {
  res.clearCookie("token", cookieOptions);
  res.redirect(process.env.CLIENT_URL || "/");
});

/**
 * 🟡 STEP 6: Forgot Password
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: "If an account with that email exists, we sent a password reset link." });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google Login. Please log in with Google." });
    }

    // Generate token
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiration

    // Save token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // TODO: Send email using your preferred provider here
    console.log("\n========================================================");
    console.log(`[MOCK EMAIL SYSTEM] Password reset requested for ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log("========================================================\n");

    return res.status(200).json({ message: "If an account with that email exists, we sent a password reset link." });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

/**
 * 🟡 STEP 7: Reset Password
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid password reset token." });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Expired password reset token." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;