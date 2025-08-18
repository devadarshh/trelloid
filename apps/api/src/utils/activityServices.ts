import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { getAuth } from "@clerk/express";
import prisma from "../prisma/client";

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

    // Fetch user from DB using Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) throw new Error("User not found in DB");

    // Fetch organization from DB using Clerk orgId
    const organization = await prisma.organization.findUnique({
      where: { organizationId: clerkOrgId },
    });

    if (!organization) throw new Error("Organization not found in DB");

    await prisma.auditLog.create({
      data: {
        orgId: organization.id, // ✅ your internal org PK
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id, // ✅ your internal user PK
        userImage: user.imageUrl ?? "",
        userName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
    throw error;
  }
};
