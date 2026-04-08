import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import aiRoutes from "./routes/ai.routes";
import urlRoutes from "./routes/url.routes";

async function main(): Promise<void> {
  await connectDB();

  const app = express();

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  // Gzip compression
  app.use(compression());

  // CORS
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      exposedHeaders: ["Content-Type"],
    })
  );

  // Rate limiting — tighter on auth routes
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later" },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many auth attempts, please try again later" },
  });

  app.use(globalLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);

  // Body parsing
  app.use(express.json({ limit: "10kb" })); // prevent large payload attacks
  app.use(cookieParser());

  // NoSQL injection sanitization — strips $ and . from req.body/params/query
  app.use(mongoSanitize());

  // HTTP parameter pollution protection
  app.use(hpp());

  // API Routes
  app.use("/api", authRoutes);
  app.use("/api", chatRoutes);
  app.use("/api", aiRoutes);
  app.use("/api", urlRoutes);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
  });

  // Global error handler
  app.use(errorMiddleware);

  const port = parseInt(env.PORT, 10);
  app.listen(port, () => {
    if (env.NODE_ENV !== "production") {
      console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
    }
  });
}

main().catch((err: unknown) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
