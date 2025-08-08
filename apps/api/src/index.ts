import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import authWebHook from "../src/routers/webhook.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(clerkMiddleware());

app.use(express.json());

app.use("/", authWebHook);
const PORT = process.env.PORT || 6000;

app.get("/health", async (req, res) => {
  res.json({ message: "Health is Perfect" });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
