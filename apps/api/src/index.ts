import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import authWebHook from "./routers/auth.route";
import orgWebHook from "./routers/org.route";

dotenv.config();

const app = express();

app.use(cors());

app.use(clerkMiddleware());
app.use("/", authWebHook);
app.use("/", orgWebHook);

app.use(express.json());

const PORT = process.env.PORT || 6000;

app.get("/health", async (req, res) => {
  res.json({ message: "Health is Perfect" });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
