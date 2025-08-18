import express from "express";
import {
  incrementAvailableCount,
  decreaseAvailableCount,
  hasAvailableCount,
  getAvailableCount,
} from "../controllers/orgLimits.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.use(requireAuth);

router.post("/increment", incrementAvailableCount);
router.post("/decrement", decreaseAvailableCount);
router.get("/has-available", hasAvailableCount);
router.get("/count", getAvailableCount);

export default router;
