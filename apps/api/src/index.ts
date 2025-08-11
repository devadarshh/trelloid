import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import authWebHook from "./routers/auth.route";
import orgWebHook from "./routers/org.route";
import unsplashRoutes from "./routers/unsplash.route";
import boardRoutes from "./routers/board.route";
import listRoutes from "./routers/list.route";
import cardRoutes from "./routers/card.route";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(clerkMiddleware());
app.use("/", authWebHook);
app.use("/", orgWebHook);

app.use("/api/v1", boardRoutes);
app.use("/api/v1", listRoutes);
app.use("/api/v1", cardRoutes);
app.use("/api", unsplashRoutes);

const PORT = process.env.PORT || 6000;

app.get("/health", async (req, res) => {
  res.json({ message: "Health is Perfect" });
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
