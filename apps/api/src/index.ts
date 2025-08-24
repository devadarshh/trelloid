import express, { Request, Response, NextFunction } from "express";
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

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://trelloid-lovat.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

export default app;
