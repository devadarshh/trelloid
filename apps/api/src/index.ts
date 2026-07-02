import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import authWebHook from "./routers/auth.route";
import orgRoutes from "./routers/org.route";
import unsplashRoutes from "./routers/unsplash.route";
import boardRoutes from "./routers/board.route";
import listRoutes from "./routers/list.route";
import cardRoutes from "./routers/card.route";
import activityRoutes from "./routers/activity.route";
import stripeRoutes from "./routers/stripe.route";
import orgLimitRoutes from "./routers/orgLimits.route";
import prisma from "./prisma";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  override: true,
});

const app = express();
const isDev = process.env.NODE_ENV !== "production";
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://trelloidapp.vercel.app",
  "https://trelloid.adarshsingh.xyz",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter((origin, index, origins) => origins.indexOf(origin) === index);

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (isDev && /^http:\/\/localhost:\d+$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ok: true, db: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ ok: false, db: "disconnected" });
  }
});

app.use("/", orgRoutes);
app.use(clerkMiddleware());

app.use("/", authWebHook);

app.use("/api/v1", boardRoutes);
app.use("/api/v1", listRoutes);
app.use("/api/v1", cardRoutes);
app.use("/api/v1", orgLimitRoutes);
app.use("/", stripeRoutes);
app.use("/api/v1/audit-logs", activityRoutes);
app.use("/api", unsplashRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

const PORT = Number(process.env.PORT) || 5001;

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the other process or change PORT in .env`
      );
    } else {
      console.error("Failed to start server:", err);
    }
    process.exit(1);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return server;
}

if (require.main === module) {
  startServer();
}

export default app;
