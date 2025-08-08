import express from "express";
import { syncUserInDB } from "../controllers/auth.controller";
const router = express.Router();

router.post(
  "/register",
  express.raw({ type: "application/json" }),
  syncUserInDB
);

export default router;


