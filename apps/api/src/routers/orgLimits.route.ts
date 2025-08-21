import express from "express";
import {
  handleGetAvailableCount,
  checkOrgSubscription,
} from "../controllers/orgLimits.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.use(requireAuth());

router.get("/count", handleGetAvailableCount);
router.get("/subscription-status", checkOrgSubscription);

export default router;
