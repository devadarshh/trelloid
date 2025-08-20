import express from "express";
import {
  createAuditLogController,
  getCardAuditLogs,
  getOrgAuditLogsController,
} from "../controllers/activity.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.post("/", requireAuth(), createAuditLogController);
router.get("/org/:orgId", requireAuth(), getOrgAuditLogsController);

router.get("/card/:cardId", requireAuth(), getCardAuditLogs);

export default router;
