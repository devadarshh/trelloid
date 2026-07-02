import { Request } from "express";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { getAuth } from "@clerk/express";
import prisma from "../prisma";
import { ensureOrganization } from "./ensureOrganization";
import { ensureUser } from "./ensureUser";

interface AuditLogProps {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
  req: any;
}

export const createAuditLog = async (props: AuditLogProps) => {
  try {
    const { entityId, entityType, entityTitle, action, req } = props;
    const { userId: clerkUserId, orgId: clerkOrgId } = getAuth(req);

    if (!clerkUserId || !clerkOrgId) {
      throw new Error("User or Organization not found!");
    }

    const user = await ensureUser(clerkUserId);
    const organization = await ensureOrganization(clerkOrgId);

    await prisma.auditLog.create({
      data: {
        orgId: organization.id,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user.imageUrl ?? "",
        userName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
};
