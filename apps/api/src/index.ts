import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 6000;

app.get("/health", async (req, res) => {
  res.json({ message: "Health is Perfect" });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
