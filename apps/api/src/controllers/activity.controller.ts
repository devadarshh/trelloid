import { Request, Response } from "express";
import { createAuditLog } from "../utils/activityServices";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import prisma from "../prisma/client";
import { getAuth } from "@clerk/express";
import { z } from "zod";

const createAuditLogSchema = z.object({
  entityId: z.string().min(1, "entityId is required"),
  entityType: z.nativeEnum(ENTITY_TYPE),
  entityTitle: z.string().min(1, "entityTitle is required"),
  action: z.nativeEnum(ACTION),
});

const getOrgAuditLogsSchema = z.object({
  orgId: z.string().min(1, "orgId is required"),
});

const getCardAuditLogsSchema = z.object({
  cardId: z.string().min(1, "cardId is required"),
});

export const createAuditLogController = async (req: Request, res: Response) => {
  try {
    const parsed = createAuditLogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.format(),
      });
    }
    const { entityId, entityType, entityTitle, action } = parsed.data;

    await createAuditLog({
      req,
      entityId,
      entityType,
      entityTitle,
      action,
    });

    return res.status(201).json({ message: "Audit log created successfully" });
  } catch (error) {
    console.error("[AUDIT_LOG_CONTROLLER_ERROR]", error);
    return res.status(500).json({ message: "Failed to create audit log" });
  }
};

export const getOrgAuditLogsController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedParams = getOrgAuditLogsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid orgId",
        errors: parsedParams.error.format(),
      });
    }
    const { orgId } = parsedParams.data;

    const { userId: clerkUserId, orgId: clerkOrgId } = getAuth(req);

    if (!clerkUserId || !clerkOrgId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (clerkOrgId !== orgId) {
      return res.status(403).json({
        message: "Forbidden: you cannot access this organization's logs",
      });
    }

    const org = await prisma.organization.findUnique({
      where: { organizationId: clerkOrgId },
    });
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: { orgId: org.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return res
      .status(200)
      .json({ message: "Audit logs fetched successfully", data: auditLogs });
  } catch (error) {
    console.error("[ORG_AUDIT_LOGS_ERROR]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCardAuditLogs = async (req: Request, res: Response) => {
  try {
    const parsedParams = getCardAuditLogsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid cardId",
        errors: parsedParams.error.format(),
      });
    }
    const { cardId } = parsedParams.data;

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

    const auditLogs = await prisma.auditLog.findMany({
      where: { orgId: org.id, entityId: cardId, entityType: ENTITY_TYPE.CARD },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return res.status(200).json({
      message: "Card audit logs fetched successfully",
      data: auditLogs,
    });
  } catch (error) {
    console.error("[GET_CARD_AUDIT_LOGS_ERROR]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
