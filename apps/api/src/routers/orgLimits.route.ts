import express from "express";
import { handleGetAvailableCount } from "../controllers/orgLimits.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.use(requireAuth());

router.get("/count", handleGetAvailableCount);

export default router;
