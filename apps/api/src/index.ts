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

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.use("/", authWebHook);
app.use("/", orgRoutes);

app.use("/api/v1", boardRoutes);
app.use("/api/v1", listRoutes);
app.use("/api/v1", cardRoutes);
app.use("/api", stripeRoutes);
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
