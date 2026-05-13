import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

import "./auth/passport";
import authRoutes from "./auth/routes";
import protectedRoutes from "./routes/protected";
import profileRoutes from "./routes/profile";
import skillsRoutes from "./routes/skills";
import projectRoutes from "./routes/projects";
import employerJobs from "./routes/employerJobs";
import employerApplications from "./routes/employerApplications";
import studentApplications from "./routes/studentApplications";
import adminJobs from "./routes/adminJobs";
import adminCourses from "./routes/adminCourses";
import publicJobs from "./routes/publicJobs";
import publicCourses from "./routes/publicCourses";
import applicationsRoutes from "./routes/applications";
import followRoutes from "./routes/followRoutes";
import employersRoutes from "./routes/employers";
import chatRoutes from "./routes/chat";

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
});
app.use("/api", limiter);
app.use("/auth", limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.send("StuNet API running");
});

// Routes
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/employer/jobs", employerJobs);
app.use("/api/employer/applications", employerApplications);
app.use("/api/student/applications", studentApplications);
app.use("/api/admin", adminJobs);
app.use("/api/admin", adminCourses);
app.use("/api", publicJobs);
app.use("/api/public", publicCourses);
app.use("/api", applicationsRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/employers", employersRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
