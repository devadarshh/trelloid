import express from "express";
import { handleRegisterUser } from "../controllers/webhook.controller";
const router = express.Router();

router.post(
  "/register",
  express.raw({ type: "application/json" }),
  handleRegisterUser
);

export default router;
