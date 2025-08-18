import { Request, Response } from "express";
import { createAuditLog } from "../utils/activityServices";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import prisma from "../prisma/client";
import { getAuth } from "@clerk/express";

// POST /api/v1/audit-logs
export const createAuditLogController = async (req: Request, res: Response) => {
  try {
    const { entityId, entityType, entityTitle, action } = req.body;

    await createAuditLog({
      req,
      entityId,
      entityType: entityType as ENTITY_TYPE,
      entityTitle,
      action: action as ACTION,
    });

    res.status(201).json({ message: "Audit log created successfully" });
  } catch (error) {
    console.error("[AUDIT_LOG_CONTROLLER_ERROR]", error);
    res.status(500).json({ error: "Failed to create audit log" });
  }
};

export const getOrgAuditLogsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId: clerkUserId, orgId: clerkOrgId } = getAuth(req);
    const { orgId } = req.params;

    if (!clerkUserId || !clerkOrgId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure requesting org matches Clerk org
    if (clerkOrgId !== orgId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const org = await prisma.organization.findUnique({
      where: { organizationId: clerkOrgId },
    });

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: { orgId: org.id },
      include: { user: true }, // fetch linked user
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: auditLogs });
  } catch (error) {
    console.error("[ORG_AUDIT_LOGS_ERROR]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};
// GET /api/v1/audit-logs/card/:cardId
export const getCardAuditLogs = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId, orgId: clerkOrgId } = getAuth(req);

    if (!clerkUserId || !clerkOrgId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const org = await prisma.organization.findUnique({
      where: { organizationId: clerkOrgId },
    });

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const { cardId } = req.params;

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        orgId: org.id, // ✅ use internal PK
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      include: {
        user: true, // fetch linked user details
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return res.status(200).json({ data: auditLogs });
  } catch (error) {
    console.error("[GET_CARD_AUDIT_LOGS_ERROR]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};
