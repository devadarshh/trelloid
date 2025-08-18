import express from "express";
import {
  createAuditLogController,
  getCardAuditLogs,
} from "../controllers/activity.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// POST /api/v1/audit-logs
router.post("/", requireAuth(), createAuditLogController);

// GET /api/v1/audit-logs/card/:cardId
router.get("/card/:cardId", requireAuth(), getCardAuditLogs);

export default router;
